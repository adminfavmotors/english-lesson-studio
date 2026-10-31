import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium, expect } from 'playwright/test';
import { createServer } from 'vite';
import { testDatabase } from './helpers/test-database.ts';

test('personal invitation: teacher card → sign-in → confirmed identity → connection', { timeout: 120000 }, async () => {
  const db = await testDatabase();
  const server = await createServer({ resolve:{alias:{'@clerk/react':fileURLToPath(new URL('./fixtures/clerk-react.tsx',import.meta.url))}}, server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const pageErrors: string[] = [];
  const apiErrors: string[] = [];
  try {
    await server.listen();
    const address = server.httpServer!.address();
    assert.ok(address && typeof address !== 'string');
    const origin = `http://127.0.0.1:${address.port}`;
    const users = [
      { id: 'c0000000-0000-4000-8000-000000000001', email: 'teacher-browser@example.invalid' },
      { id: 'c0000000-0000-4000-8000-000000000002', email: 'learner-browser@example.invalid' },
      { id: 'c0000000-0000-4000-8000-000000000003', email: 'other-browser@example.invalid' },
    ];
    for (const user of users) {
      await db.query('insert into lesson_private.accounts(id,email,email_confirmed_at,clerk_user_id) values($1,$2,now(),$3)', [user.id,user.email,'user_'+user.id.replaceAll('-','')]);
      await db.query("insert into public.workspace_members(user_id,role) values($1,'student')",[user.id]);
    }
    await db.query('insert into lesson_private.clerk_settings(issuer,allowed_origins) values($1,$2)',['https://qa.clerk.accounts.dev',[origin]]);
    await db.query("update public.workspace_members set role='teacher' where user_id=$1", [users[0].id]);
    await db.query(`insert into public.teacher_students(id,owner_id,full_name,email,notes) values
      ('c1000000-0000-4000-8000-000000000001',$1,'Invited learner',$2,'PRIVATE QA NOTE')`, [users[0].id,users[1].email]);
    const sessions = users.map(user => {
      const exp = Math.floor(Date.now()/1000)+3600;
      const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
      return { access_token: `${encode({alg:'HS256',typ:'JWT'})}.${encode({sub:'user_'+user.id.replaceAll('-',''),sid:'sess_qa',sts:'active',iss:'https://qa.clerk.accounts.dev',azp:origin,email:user.email,email_verified:true,role:'authenticated',aud:'authenticated',exp})}.qa-signature`, refresh_token: 'qa-refresh-only', token_type: 'bearer', expires_in: 3600, expires_at: exp, user: { ...user, aud:'authenticated',role:'authenticated',email_confirmed_at:new Date().toISOString(),app_metadata:{provider:'email'},user_metadata:{},created_at:new Date().toISOString() } };
    });
    const functions: Record<string,string[]> = {
      workspace_account: [], workspace_role: [], student_connections: [], student_invitation_status: ['p_student_id'],
      student_invitation_create: ['p_student_id','p_version'], student_invitation_revoke: ['p_student_id'],
      student_invitation_read: ['p_token'], student_invitation_accept: ['p_token'],
    };
    let queue = Promise.resolve();
    const context = async (sessionIndex?: number) => {
      const context = await browser.newContext({ viewport: {width:1280,height:900}, permissions:['clipboard-read','clipboard-write'] });
      // Auth is a local fixture. All data/RPC calls below execute the real migrations,
      // ownership checks and RLS in PGlite. No request reaches the working project.
      await context.route('https://*.supabase.co/**', async route => {
        const request = route.request();
        const url = new URL(request.url());
        const headers: Record<string,string> = { 'access-control-allow-origin':origin, 'access-control-allow-headers':'*', 'access-control-expose-headers':'content-range', 'content-type':'application/json' };
        if (request.method() === 'OPTIONS') { await route.fulfill({status:204,headers}); return; }
        const session = sessions.find(session => request.headers().authorization === `Bearer ${session.access_token}`);
        const work = queue.then(async () => {
          await db.exec('begin; set local role authenticated;');
          try {
            await db.query("select set_config('request.jwt.claims',$1,true)", [session ? Buffer.from(session.access_token.split('.')[1],'base64url').toString() : '{}']);
            let body: unknown;
            if (url.pathname.startsWith('/rest/v1/rpc/')) {
              const name = url.pathname.split('/').at(-1)!;
              assert.ok(name in functions, `Unexpected RPC ${name}`);
              const params = request.postDataJSON() ?? {};
              const args = functions[name].map(key => params[key]);
              const result = await db.query(`select public.${name}(${args.map((_,index)=>'$'+(index+1)).join(',')}) as result`, args);
              body = result.rows[0].result;
            } else if (url.pathname === '/rest/v1/teacher_students') {
              const status = url.searchParams.get('status')?.replace(/^eq\./,'');
              const result = await db.query('select * from public.teacher_students' + (status ? ' where status=$1' : ''),status?[status]:[]);
              body = result.rows;
              headers['content-range'] = `0-${Math.max(0,result.rows.length-1)}/${result.rows.length}`;
            } else throw new Error('Unexpected request ' + url.pathname);
            await db.exec('commit');
            await route.fulfill({status:200,headers,body:request.method()==='HEAD'?'':JSON.stringify(body)});
          } catch (error) {
            await db.exec('rollback');
            const code = (error as {code?:string}).code;
            if (!code?.startsWith('PT')) apiErrors.push(String(error));
            await route.fulfill({status:code?.startsWith('PT')?Number(code.slice(2)):500,headers,body:JSON.stringify({code,message:(error as Error).message})});
          }
        });
        queue = work.catch(() => {});
        await work;
      });
      const page = await context.newPage();
      page.on('pageerror', error => pageErrors.push(error.message));
      await page.goto(origin);
      if (sessionIndex !== undefined) await page.evaluate(session => localStorage.setItem('lessonstudio.clerk.qa',JSON.stringify(session)),sessions[sessionIndex]);
      return { context,page };
    };

    const teacher = await context(0);
    await teacher.page.goto(origin+'/teacher/students');
    await teacher.page.getByRole('button',{name:'Invited learner',exact:false}).first().click();
    await teacher.page.getByRole('button',{name:'Create invitation link',exact:true}).click();
    const firstLink = await teacher.page.getByLabel('Personal invitation link').inputValue();
    await teacher.page.getByRole('button',{name:'Copy invitation link',exact:true}).click();
    await expect(teacher.page.getByRole('button',{name:'Copied',exact:true})).toBeVisible();
    await teacher.page.getByRole('button',{name:'Replace invitation link',exact:true}).click();
    const replacedLink = await teacher.page.getByLabel('Personal invitation link').inputValue();
    assert.notEqual(replacedLink,firstLink);
    await teacher.page.getByRole('button',{name:'Revoke invitation',exact:true}).click();
    await expect(teacher.page.getByText('The previous invitation has been revoked.')).toBeVisible();
    await teacher.page.getByRole('button',{name:'Create invitation link',exact:true}).click();
    const link = await teacher.page.getByLabel('Personal invitation link').inputValue();
    await teacher.page.setViewportSize({width:375,height:812});
    const dialogSize = await teacher.page.getByRole('dialog').evaluate(element => ({width:element.clientWidth,scroll:element.scrollWidth}));
    assert.ok(dialogSize.scroll<=dialogSize.width+1, 'Teacher profile overflows on mobile');
    fs.mkdirSync(new URL('../invitation-qa.local/',import.meta.url),{recursive:true});
    await teacher.page.screenshot({path:fileURLToPath(new URL('../invitation-qa.local/teacher-invitation.png',import.meta.url)),fullPage:true});

    const student = await context(2);
    await student.page.goto(link);
    await expect(student.page.getByRole('alert')).toContainText('Sign in with the email address your teacher invited');
    // A fragment-only navigation must replace the invitation being checked.
    await student.page.goto(replacedLink);
    await expect(student.page.getByRole('alert')).toContainText('This invitation is unavailable.');
    await student.page.goto(link);
    await expect(student.page.getByRole('alert')).toContainText('Sign in with the email address your teacher invited');
    await student.page.getByRole('button',{name:'Sign out',exact:true}).click();
    await expect(student.page.getByRole('heading',{name:'Sign in or create an account'})).toBeVisible();
    assert.equal(student.page.url(),origin+'/login','Signing out returns to local account access');
    assert.equal(await student.page.evaluate(()=>sessionStorage.getItem('lessonstudio.account-return.v1')),new URL(link).pathname+new URL(link).hash,'Switching account must preserve the invitation locally');
    await expect(student.page.getByText('Sign in with the email address your teacher invited.',{exact:false})).toBeVisible();
    await student.page.evaluate(session=>localStorage.setItem('lessonstudio.clerk.qa',JSON.stringify(session)),sessions[1]);
    await student.page.reload();
    await expect(student.page.getByRole('button',{name:'Accept invitation',exact:true})).toBeVisible();
    await student.page.setViewportSize({width:375,height:812});
    await student.page.emulateMedia({reducedMotion:'reduce'});
    await student.page.getByRole('button',{name:'Accept invitation',exact:true}).click();
    await expect(student.page.getByRole('heading',{name:'You’re connected.'})).toBeVisible();
    await expect(student.page.getByRole('heading',{name:'You’re connected.'})).toBeFocused();
    assert.equal(await student.page.locator('body').innerText().then(text=>text.includes('PRIVATE QA NOTE')),false);
    assert.ok(await student.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await student.page.reload();
    await expect(student.page.getByRole('heading',{name:'You’re connected.'})).toBeVisible();
    await student.page.getByRole('link',{name:'Open your learning space',exact:true}).click();
    await expect(student.page.getByRole('heading',{name:'Connected with your teacher',exact:true})).toBeVisible();
    await student.page.screenshot({path:fileURLToPath(new URL('../invitation-qa.local/student-connected.png',import.meta.url)),fullPage:true});
    await teacher.page.getByRole('button',{name:'Refresh connection status',exact:true}).click();
    await expect(teacher.page.getByText('Account connected. This student has accepted your invitation.',{exact:false})).toBeVisible();

    const fresh = await context();
    await fresh.page.goto(link);
    await expect(fresh.page.getByRole('heading',{name:'Sign in or create an account'})).toBeVisible();
    await expect(fresh.page.getByLabel('Email address',{exact:true})).toBeVisible();
    assert.equal(fresh.page.url(),origin+'/login');
    assert.equal(await fresh.page.evaluate(()=>sessionStorage.getItem('lessonstudio.account-return.v1')),new URL(link).pathname+new URL(link).hash);
    assert.deepEqual(pageErrors,[]);
    assert.deepEqual(apiErrors,[]);
    const result = await db.query("select student_user_id,notes from public.teacher_students where id='c1000000-0000-4000-8000-000000000001'");
    assert.equal(result.rows[0].student_user_id,users[1].id);
    assert.equal(result.rows[0].notes,'PRIVATE QA NOTE');
  } finally {
    await browser.close(); await server.close(); await db.close();
  }
});
