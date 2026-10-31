import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium, expect } from 'playwright/test';
import { createServer, loadEnv } from 'vite';

const configured=!!loadEnv('development',process.cwd(),'VITE_').VITE_CLERK_PUBLISHABLE_KEY;
test('real Clerk Account Portal owns sign-in and sign-up; invitation secrets stay local', {skip:!configured,timeout:120000},async()=>{
  const server=await createServer({server:{host:'127.0.0.1',port:0},logLevel:'error'});
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const errors:string[]=[];
  const results:object[]=[];
  try {
    await server.listen();
    const address=server.httpServer!.address();assert.ok(address&&typeof address!=='string');
    const origin=`http://127.0.0.1:${address.port}`;
    const invitation='a'.repeat(64);
    for(const action of ['Sign in','Create account']) {
      const context=await browser.newContext({viewport:{width:375,height:812}});
      const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
      await page.goto(origin+'/student/connect#invite='+invitation);
      await expect(page.getByRole('heading',{name:'Welcome back.'})).toBeVisible({timeout:30000});
      await expect(page.locator('input[type=password],input[type=email]')).toHaveCount(0);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      if(action==='Sign in') await page.screenshot({path:fileURLToPath(new URL('../clerk-setup.local/local-account-entry.png',import.meta.url)),fullPage:true});
      await page.getByRole('button',{name:action,exact:true}).click();
      await page.waitForURL(url=>url.hostname.endsWith('.accounts.dev'),{timeout:30000});
      assert.ok(!page.url().includes(invitation),'Invitation secret was sent to Clerk');
      assert.ok(!page.url().includes('invite='),'Invitation fragment was sent to Clerk');
      assert.equal(new URL(page.url()).pathname,action==='Sign in'?'/sign-in':'/sign-up');
      await expect(page.locator('input').first()).toBeVisible({timeout:30000});
      fs.mkdirSync(new URL('../clerk-setup.local/',import.meta.url),{recursive:true});
      await page.screenshot({path:fileURLToPath(new URL(`../clerk-setup.local/portal-${action==='Sign in'?'signin':'signup'}.png`,import.meta.url)),fullPage:true});
      results.push({action,portalHost:new URL(page.url()).hostname,path:new URL(page.url()).pathname,invitationSecretLeaked:false});
      await context.close();
    }
    assert.deepEqual(errors,[]);
    fs.writeFileSync(new URL('../clerk-setup.local/portal-check.json',import.meta.url),JSON.stringify({results,pageErrors:errors},null,2));
  } finally {await browser.close();await server.close();}
});
