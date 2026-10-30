import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium, expect } from 'playwright/test';
import { createServer } from 'vite';
import { testDatabase } from './helpers/test-database.ts';
import { readMaterialDocument } from '../src/material-model.ts';

test('independent catalogue filters → lesson → saved writing; reviewed and both legacy JSON formats round-trip', {timeout: 120000}, async () => {
  const db = await testDatabase();
  const server = await createServer({server: {host: '127.0.0.1', port: 0}, logLevel: 'error'});
  const browser = await chromium.launch({channel: 'msedge', headless: true});
  const errors: string[] = [];
  let queue = Promise.resolve();
  try {
    await server.listen();
    const address = server.httpServer!.address();
    assert.ok(address && typeof address !== 'string');
    const origin = `http://127.0.0.1:${address.port}`;
    const user = {id: 'f1000000-0000-4000-8000-000000000001', email: 'catalogue-browser@example.invalid'};
    await db.query('insert into auth.users(id,email,email_confirmed_at) values($1,$2,now())', [user.id,user.email]);
    await db.query("update public.workspace_members set role='teacher' where user_id=$1", [user.id]);
    const exp = Math.floor(Date.now()/1000)+3600;
    const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
    const session = {
      access_token: `${encode({alg:'HS256',typ:'JWT'})}.${encode({sub:user.id,role:'authenticated',aud:'authenticated',exp})}.local-qa-signature`,
      refresh_token: 'local-qa-refresh', token_type: 'bearer', expires_in: 3600, expires_at: exp,
      user: {...user, aud:'authenticated',role:'authenticated',email_confirmed_at:new Date().toISOString(),
        app_metadata:{provider:'email'},user_metadata:{},created_at:new Date().toISOString()},
    };
    const columns = new Set(['id','owner_id','title','subtitle','level','topic','skills','language_focus','classification_status','legacy_skills','duration','sequence','content','version','catalogue_version','created_at','updated_at','search_text']);
    const insertable = new Set(['id','title','subtitle','level','topic','skills','language_focus','classification_status','legacy_skills','duration','sequence','content']);
    const context = await browser.newContext({acceptDownloads: true, viewport:{width:1280,height:900}});
    await context.addInitScript(session => {
      localStorage.setItem('lessonstudio.teacher.auth.v1', JSON.stringify(session));
    }, session);
    // Auth is synthetic. Every data request executes the real schema and RLS
    // locally; no request is forwarded to the working Supabase project.
    await context.route('https://*.supabase.co/**', async route => {
      const request = route.request();
      const url = new URL(request.url());
      const headers: Record<string,string> = {'access-control-allow-origin':origin,'access-control-allow-headers':'*','content-type':'application/json'};
      if (request.method()==='OPTIONS') { await route.fulfill({status:204,headers}); return; }
      const work = queue.then(async () => {
        await db.exec('begin; set local role authenticated;');
        try {
          assert.equal(request.headers().authorization, `Bearer ${session.access_token}`);
          await db.query("select set_config('request.jwt.claims',$1,true)", [JSON.stringify({sub:user.id,role:'authenticated'})]);
          let body: unknown;
          if (url.pathname==='/rest/v1/rpc/workspace_role') {
            body = (await db.query('select public.workspace_role() as role')).rows[0].role;
          } else if (url.pathname==='/rest/v1/material_favourites' && request.method()==='GET') {
            body = (await db.query('select material_id from public.material_favourites')).rows;
          } else if (url.pathname==='/rest/v1/lesson_materials') {
            if (request.method()==='POST') {
              const payload = request.postDataJSON();
              const fields = Object.keys(payload);
              assert.ok(fields.every(field => insertable.has(field)));
              const values = fields.map(field => payload[field] !== null && ['content','skills','language_focus','legacy_skills'].includes(field) ? JSON.stringify(payload[field]) : payload[field]);
              body = (await db.query(`insert into public.lesson_materials(${fields.join(',')}) values(${fields.map((_,i)=>'$'+(i+1)).join(',')}) returning *`, values)).rows[0];
            } else {
              const selected = url.searchParams.get('select') ?? '*';
              assert.ok(selected==='*' || selected.split(',').every(field=>columns.has(field)));
              const id = url.searchParams.get('id')?.replace(/^eq\./,'');
              const result = await db.query(`select ${selected} from public.lesson_materials ${id?'where id=$1':''} order by sequence nulls last,id`, id?[id]:[]);
              body = request.headers().accept?.includes('vnd.pgrst.object') ? result.rows[0] : result.rows;
            }
          } else throw new Error('Unexpected API request: '+url.pathname);
          await db.exec('commit');
          await route.fulfill({status:request.method()==='POST' && url.pathname==='/rest/v1/lesson_materials'?201:200,headers,body:JSON.stringify(body)});
        } catch (error) {
          await db.exec('rollback');
          errors.push(String(error));
          await route.fulfill({status:500,headers,body:JSON.stringify({message:(error as Error).message})});
        }
      });
      queue = work.catch(error => {errors.push(String(error));});
      await work;
    });
    const page = await context.newPage();
    page.on('pageerror', error=>errors.push(error.message));
    await page.goto(origin+'/teacher/materials');
    await expect(page.getByText('Results: 30',{exact:true})).toBeVisible();
    await page.locator('.library-pagination').getByRole('button',{name:'Next',exact:true}).click();
    await expect(page.getByText('Page 2 of 4',{exact:true})).toBeVisible();
    const skills = page.getByRole('combobox',{name:'Skills',exact:true});
    const focus = page.getByRole('combobox',{name:'Language focus',exact:true});
    await expect(skills.getByRole('option',{name:'Grammar',exact:true})).toHaveCount(0);
    await expect(focus.getByRole('option',{name:'Reading',exact:true})).toHaveCount(0);
    await skills.selectOption('reading');
    await expect(page.getByText('Results: 5',{exact:true})).toBeVisible();
    await focus.selectOption('spelling_punctuation');
    await expect(page.getByText('Results: 1',{exact:true})).toBeVisible();
    await expect(page.getByRole('button',{name:'Colours and favourite things',exact:true})).toBeVisible();
    await expect(page.locator('.material-card').getByText('Spelling and punctuation',{exact:true})).toBeVisible();
    await focus.selectOption('pronunciation');
    await expect(page.getByRole('heading',{name:'No matching lessons',exact:true})).toBeVisible();
    await page.getByRole('button',{name:'Clear filters',exact:true}).click();
    await expect(skills).toHaveValue(''); await expect(focus).toHaveValue('');
    await expect(page.getByText('Results: 30',{exact:true})).toBeVisible();
    const screenshotRoot = new URL('../internal-docs/sources/screenshots/material-classification-2026-10-30/',import.meta.url);
    fs.mkdirSync(screenshotRoot,{recursive:true});
    const capture = async (name: string) => {
      // Full-page captures otherwise place the sticky header at the current
      // scrolled viewport and can retain focus on a control that just unmounted.
      await page.evaluate(() => {
        (document.activeElement as HTMLElement | null)?.blur();
        window.scrollTo({top:0,behavior:'instant'});
      });
      await page.screenshot({path:fileURLToPath(new URL(name,screenshotRoot)),fullPage:true});
    };
    await capture('library-desktop.png');
    for(const width of [375,768,1024]) {
      await page.setViewportSize({width,height:900});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),`Library overflow at ${width}px`);
    }
    await page.setViewportSize({width:375,height:812});
    await focus.selectOption('spelling_punctuation');
    await expect(page.getByText('Results: 5',{exact:true})).toBeVisible();
    await capture('library-mobile.png');
    await focus.selectOption('');
    await page.setViewportSize({width:1280,height:900});
    await page.getByPlaceholder('Search by title or topic').fill('At the café');
    await page.getByRole('button',{name:'At the café',exact:true}).click();
    await expect(page.getByRole('heading',{name:'At the café',exact:true})).toBeVisible();
    await page.getByRole('button',{name:/Write/}).click();
    const writing = 'Keep my original order — Олена';
    await page.getByRole('textbox',{name:'Your writing',exact:true}).fill(writing);
    await expect.poll(()=>page.evaluate(()=>Object.values(localStorage).some(value=>value.includes('Keep my original order')))).toBe(true);
    await queue;
    const previous = (await db.query("select * from public.lesson_materials where id='a1-14'")).rows[0];
    await db.exec("update public.lesson_materials set title='At the café — catalogue QA',topic='Eating out',language_focus='[\"vocabulary\",\"grammar\"]' where id='a1-14'");
    await page.reload();
    await expect(page.getByRole('heading',{name:'At the café — catalogue QA',exact:true})).toBeVisible();
    await page.getByRole('button',{name:/Write/}).click();
    await expect(page.getByRole('textbox',{name:'Your writing',exact:true})).toHaveValue(writing);
    const revised = (await db.query("select * from public.lesson_materials where id='a1-14'")).rows[0];
    assert.equal(revised.version,previous.version);
    assert.equal(revised.catalogue_version,2);
    assert.deepEqual(revised.content,previous.content);

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button',{name:'Download lesson JSON',exact:true}).click(),
    ]);
    const downloadPath = await download.path();
    assert.ok(downloadPath);
    const native = JSON.parse(fs.readFileSync(downloadPath,'utf8'));
    assert.equal(native.catalogue.title,'At the café — catalogue QA');
    assert.equal(native.content.schemaVersion,2);
    assert.equal(Object.hasOwn(native.content,'title'),false);
    assert.deepEqual(readMaterialDocument(native).errors,[]);
    assert.equal(native.catalogue.classification_status,'reviewed');
    assert.deepEqual(native.catalogue.language_focus,['vocabulary','grammar']);

    const importThroughUi = async (value: unknown, title: string) => {
      await page.goto(origin+'/teacher/materials');
      await page.getByRole('button',{name:'Import lesson',exact:true}).click();
      await page.getByLabel('Lesson JSON',{exact:true}).fill(JSON.stringify(value));
      await page.getByRole('dialog').getByRole('button',{name:'Import lesson',exact:true}).click();
      await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();
    };
    await page.goto(origin+'/teacher/materials');
    await page.getByRole('button',{name:'Import lesson',exact:true}).click();
    await page.getByLabel('Lesson JSON',{exact:true}).fill(JSON.stringify({...native,catalogue:{...native.catalogue,skills:['grammar']}}));
    await page.getByRole('dialog').getByRole('button',{name:'Import lesson',exact:true}).click();
    await expect(page.getByRole('alert').getByText('Skills must contain distinct values: Reading, Listening, Speaking or Writing.',{exact:true})).toBeVisible();
    await page.getByRole('button',{name:'Close lesson import',exact:true}).click();
    const legacy = JSON.parse(fs.readFileSync(new URL('./fixtures/material-v1.json',import.meta.url),'utf8'));
    legacy.title = 'Legacy import QA';
    await importThroughUi(legacy,legacy.title);
    await expect(page.getByText('Classification needs review',{exact:true})).toBeVisible();
    await expect(page.getByText('Previous tags: Speaking, Vocabulary, Pronunciation',{exact:true})).toBeVisible();
    const separated = JSON.parse(fs.readFileSync(new URL('./fixtures/material-v2.json',import.meta.url),'utf8'));
    separated.catalogue.title = 'Previous separated import QA';
    await importThroughUi(separated,separated.catalogue.title);
    await expect(page.getByText('Classification needs review',{exact:true})).toBeVisible();
    native.catalogue.title = 'Native import QA';
    await importThroughUi(native,native.catalogue.title);
    await queue;
    const imported = (await db.query('select * from public.lesson_materials where owner_id=$1 order by title',[user.id])).rows;
    assert.equal(imported.length,3);
    for (const row of imported) {
      assert.equal(row.sequence,null);
      assert.equal(row.version,1);
      assert.equal(row.catalogue_version,1);
      assert.equal(row.content.schemaVersion,2);
      assert.equal(Object.hasOwn(row.content,'title'),false);
    }
    const pending=imported.filter(row=>row.classification_status==='needs_review');
    assert.equal(pending.length,2);
    for(const row of pending){assert.equal(row.skills,null);assert.equal(row.language_focus,null);
      assert.deepEqual(row.legacy_skills,legacy.skills);}
    await page.goto(origin+'/teacher/materials');
    await page.getByRole('button',{name:'My materials',exact:true}).click();
    await expect(page.getByText('Results: 3',{exact:true})).toBeVisible();
    await page.getByRole('combobox',{name:'Skills',exact:true}).selectOption('speaking');
    await expect(page.getByText('Results: 1',{exact:true})).toBeVisible();
    await expect(page.getByRole('button',{name:'Native import QA',exact:true})).toBeVisible();
    await page.getByRole('combobox',{name:'Skills',exact:true}).selectOption('');
    await expect(page.getByText('Classification needs review',{exact:true})).toHaveCount(2);
    await page.setViewportSize({width:375,height:812});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1));
    await capture('private-imports-mobile.png');
    assert.deepEqual(errors,[]);
    await context.close();
  } finally {
    await browser.close();
    await queue;
    await server.close();
    await db.close();
  }
});
