import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium, expect } from 'playwright/test';
import { createServer } from 'vite';
import { testDatabase } from './helpers/test-database.ts';
import { dictationWords } from '../src/dictation-model.ts';

test('library → assigned homework → saved dictation → submission → teacher review on both accounts', { timeout: 180000 }, async () => {
 const db=await testDatabase();
 const server=await createServer({resolve:{alias:{'@clerk/react':fileURLToPath(new URL('./fixtures/clerk-react.tsx',import.meta.url))}},server:{host:'127.0.0.1',port:0},logLevel:'error'});
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const errors:string[]=[];let queue=Promise.resolve();let complete=false;
 try{
  await server.listen();const address=server.httpServer!.address();assert.ok(address&&typeof address!=='string');const origin=`http://127.0.0.1:${address.port}`;
  const users=[{id:'e4000000-0000-4000-8000-000000000001',email:'teacher-homework@example.invalid',role:'teacher'},{id:'e4000000-0000-4000-8000-000000000002',email:'learner-homework@example.invalid',role:'student'}];
  await db.query('insert into lesson_private.clerk_settings(issuer,allowed_origins) values($1,$2)',['https://qa.clerk.accounts.dev',[origin]]);
  for(const user of users){await db.query('insert into lesson_private.accounts(id,email,email_confirmed_at,clerk_user_id) values($1,$2,now(),$3)',[user.id,user.email,'user_'+user.id.replaceAll('-','')]);await db.query('insert into public.workspace_members(user_id,role) values($1,$2)',[user.id,user.role]);}
  const card='e5000000-0000-4000-8000-000000000001';
  await db.query('insert into public.teacher_students(id,owner_id,full_name,email,student_user_id,connected_at) values($1,$2,$3,$4,$5,now())',[card,users[0].id,'Dictation learner',users[1].email,users[1].id]);
  const document=JSON.parse(fs.readFileSync(new URL('../scripts/materials/dictation-in-the-news.json',import.meta.url),'utf8'));
  const fields=[...Object.keys(document.catalogue),'content'],values=[...Object.values(document.catalogue),document.content].map(v=>v&&typeof v==='object'?JSON.stringify(v):v);
  await db.query(`insert into public.lesson_materials(id,${fields.join(',')}) values($1,${fields.map((_,i)=>'$'+(i+2)).join(',')})`,['dictation-in-the-news',...values]);
  const rpc:Record<string,string[]>={workspace_account:[],workspace_role:[],student_connections:[],student_invitation_status:['p_student_id'],homework_list:['p_student_id'],homework_create:['p_id','p_student_id','p_material_id'],homework_get:['p_id'],homework_save:['p_id','p_version','p_progress'],homework_submit:['p_id','p_version','p_progress'],homework_review:['p_id','p_version','p_feedback']};
  const makeContext=async(index:number)=>{
   const context=await browser.newContext({viewport:{width:1280,height:900}});const user=users[index];const encode=(v:unknown)=>Buffer.from(JSON.stringify(v)).toString('base64url');
   const claims={iss:'https://qa.clerk.accounts.dev',azp:origin,sub:'user_'+user.id.replaceAll('-',''),sid:'sess_homeworkBrowser',sts:'active',email:user.email,email_verified:true,role:'authenticated',exp:Math.floor(Date.now()/1000)+3600};
   const session={user,access_token:encode({alg:'HS256'})+'.'+encode(claims)+'.fixture'};
   await context.addInitScript(s=>localStorage.setItem('lessonstudio.clerk.qa',JSON.stringify(s)),session);
   await context.route('https://*.supabase.co/**',async route=>{
    const request=route.request(),url=new URL(request.url());const headers:Record<string,string>={'access-control-allow-origin':origin,'access-control-allow-headers':'*','access-control-expose-headers':'content-range','content-type':'application/json'};
    if(request.method()==='OPTIONS'){await route.fulfill({status:204,headers});return;}
    const work=queue.then(async()=>{
     await db.exec('begin;set local role authenticated');
     try{
      assert.equal(request.headers().authorization,'Bearer '+session.access_token);await db.query("select set_config('request.jwt.claims',$1,true)",[JSON.stringify(claims)]);let body:unknown;
      if(url.pathname.startsWith('/rest/v1/rpc/')){
       const name=url.pathname.split('/').at(-1)!;assert.ok(name in rpc,`Unexpected RPC ${name}`);const params=request.postDataJSON()??{};
       const args=rpc[name].map(k=>{const v=params[k]??null;return v&&typeof v==='object'?JSON.stringify(v):v;});body=(await db.query(`select public.${name}(${args.map((_,i)=>'$'+(i+1)).join(',')}) as result`,args)).rows[0].result;
      }else if(url.pathname==='/rest/v1/lesson_materials'){
       const id=url.searchParams.get('id')?.replace(/^eq\./,'');const rows=(await db.query('select * from public.lesson_materials'+(id?' where id=$1':'')+' order by sequence nulls last,id',id?[id]:[])).rows;
       body=request.headers().accept?.includes('vnd.pgrst.object')?rows[0]:rows;
      }else if(url.pathname==='/rest/v1/teacher_students'){
       let rows=(await db.query('select * from public.teacher_students order by full_name,id')).rows;
       const id=url.searchParams.get('id')?.replace(/^eq\./,'');if(id)rows=rows.filter(r=>r.id===id);
       const status=url.searchParams.get('status');if(status?.startsWith('eq.'))rows=rows.filter(r=>r.status===status.slice(3));if(status?.startsWith('neq.'))rows=rows.filter(r=>r.status!==status.slice(4));
       headers['content-range']=`0-${Math.max(0,rows.length-1)}/${rows.length}`;body=rows;
      }else if(url.pathname==='/rest/v1/material_favourites')body=[];
      else throw new Error('Unexpected API '+url.pathname);
      await db.exec('commit');await route.fulfill({status:200,headers,body:request.method()==='HEAD'?'':JSON.stringify(body)});
     }catch(error){await db.exec('rollback');const code=(error as {code?:string}).code;if(!code?.startsWith('PT'))errors.push(String(error));await route.fulfill({status:code?.startsWith('PT')?Number(code.slice(2)):500,headers,body:JSON.stringify({code,message:(error as Error).message})});}
    });queue=work.catch(e=>{errors.push(String(e));});await work;
   });
   const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));return {context,page};
  };
  const teacher=await makeContext(0),student=await makeContext(1);
  await teacher.page.goto(origin+'/teacher/materials');await teacher.page.getByRole('searchbox',{name:'Search lessons'}).fill('Dictation');
  await expect(teacher.page.locator('.material-card').getByText('Studio lesson',{exact:true})).toBeVisible();
  await teacher.page.getByRole('button',{name:'Dictation: In the News',exact:true}).click();
  await expect(teacher.page.getByRole('heading',{name:'Dictation: In the News',exact:true})).toBeVisible();
  await teacher.page.getByRole('button',{name:'Assign homework',exact:true}).click();await teacher.page.getByLabel('Student',{exact:true}).selectOption(card);
  await teacher.page.getByRole('dialog').getByRole('button',{name:'Assign homework',exact:true}).click();
  await teacher.page.getByRole('link',{name:'Open homework and copy the student link',exact:true}).click();
  const link=await teacher.page.getByLabel('Student homework link',{exact:true}).inputValue();const id=new URL(link).pathname.split('/').at(-1)!;
  await expect(teacher.page.locator('.homework-badge')).toHaveText('Not completed');
  await teacher.page.goto(origin+'/teacher/students');await teacher.page.getByRole('button',{name:'Dictation learner',exact:false}).first().click();
  await expect(teacher.page.getByRole('dialog').getByRole('link',{name:'Dictation: In the News',exact:true})).toBeVisible();await expect(teacher.page.getByRole('dialog').locator('.homework-badge')).toHaveText('Not completed');
  await student.page.goto(origin+'/student/classroom');await student.page.getByRole('link',{name:'Dictation: In the News',exact:true}).click();
  await expect(student.page.getByRole('button',{name:'Send to teacher',exact:true})).toBeDisabled();
  const word=student.page.getByRole('textbox',{name:'Sentence 1, word 1',exact:true});await word.fill('thz');await word.blur();
  await expect(student.page.getByText('Almost! One letter is wrong.',{exact:true})).toBeVisible();
  await student.page.getByRole('button',{name:'Hint: sentence 1, word 1',exact:true}).click();await expect(student.page.locator('.dictation-hint').first()).toContainText('T _ _');
  await word.fill('The');await expect(student.page.getByRole('textbox',{name:'Sentence 1, word 2',exact:true})).toBeFocused();
  await expect(student.page.getByText('All answers saved.',{exact:true})).toBeVisible();await student.page.reload();await expect(word).toHaveValue('The');
  await student.page.setViewportSize({width:375,height:812});assert.ok(await student.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const screenshotRoot=new URL('../homework-qa.local/',import.meta.url);fs.mkdirSync(screenshotRoot,{recursive:true});
  await student.page.screenshot({path:fileURLToPath(new URL('student-dictation-mobile.png',screenshotRoot)),fullPage:true});
  // Exercise every displayed input against the supplied content, including apostrophes.
  for(const w of dictationWords(document.content.sentences).flat()){
   const input=student.page.getByRole('textbox',{name:`Sentence ${w.sentence}, word ${w.position}`,exact:true});
   if(await input.getAttribute('readonly')!==null)continue;
   await input.fill(w.answer);
  }
  await student.page.getByRole('button',{name:'Send to teacher',exact:true}).click();
  await expect(student.page.locator('.homework-badge')).toHaveText('Completed');
  await teacher.page.goto(origin+'/teacher/homework/'+id);await expect(teacher.page.locator('.homework-badge')).toHaveText('Completed');
  await teacher.page.getByLabel('Feedback for the student',{exact:true}).fill('Good work. Listen to mayor once more.');await teacher.page.getByRole('button',{name:'Mark as reviewed',exact:true}).click();
  await expect(teacher.page.locator('.homework-badge')).toHaveText('Reviewed');
  await teacher.page.screenshot({path:fileURLToPath(new URL('teacher-reviewed.png',screenshotRoot)),fullPage:true});
  await student.page.reload();await expect(student.page.locator('.homework-badge')).toHaveText('Reviewed');await expect(student.page.getByText('Good work. Listen to mayor once more.',{exact:true})).toBeVisible();
  await student.page.getByRole('link',{name:'Your learning space',exact:true}).click();await expect(student.page.locator('.student-home')).toBeVisible();await expect(student.page.locator('.homework-list .homework-badge')).toHaveText('Reviewed');
  await teacher.page.goto(origin+'/teacher/students');await teacher.page.getByRole('button',{name:'Dictation learner',exact:false}).first().click();await expect(teacher.page.getByRole('dialog').locator('.homework-badge')).toHaveText('Reviewed');
  await queue;assert.deepEqual(errors,[]);complete=true;
 }finally{
  if(!complete){for(const context of browser.contexts())for(const page of context.pages()){console.error((await page.locator('body').innerText()).slice(0,3000));}}
  await browser.close();await server.close();await db.close();
 }
});
