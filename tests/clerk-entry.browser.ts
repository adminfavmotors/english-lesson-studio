import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium, expect } from 'playwright/test';
import { createServer, loadEnv } from 'vite';

const configured = !!loadEnv('development', process.cwd(), 'VITE_').VITE_CLERK_PUBLISHABLE_KEY;
test('official Clerk forms stay on the account page and keep invitation credentials local', { skip: !configured, timeout: 120000 }, async () => {
  const server = await createServer({ server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const errors: string[] = [];
  const leaked: string[] = [];
  try {
    await server.listen();
    const address = server.httpServer!.address(); assert.ok(address && typeof address !== 'string');
    const origin = `http://127.0.0.1:${address.port}`;
    const invitation = 'a'.repeat(64);
    const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
    context.on('request', request => {
      if (request.url().includes(invitation) || request.postData()?.includes(invitation)) leaked.push(new URL(request.url()).pathname);
    });
    const page = await context.newPage(); page.on('pageerror', error => errors.push(error.message));
    await page.goto(origin + '/student/connect#invite=' + invitation);
    await page.waitForURL(origin + '/login');
    await expect(page.locator('input[autocomplete=email]').first()).toBeVisible({ timeout: 30000 });
    await expect(page.getByText('Sign in with the email address your teacher invited.', { exact: false })).toBeVisible();
    assert.equal(await page.evaluate(() => sessionStorage.getItem('lessonstudio.account-return.v1')), '/student/connect#invite=' + invitation);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.equal(new URL(page.url()).origin, origin);
    assert.deepEqual(leaked, []);
    assert.deepEqual(errors, []);
    fs.mkdirSync(new URL('../clerk-setup.local/', import.meta.url), { recursive: true });
    await page.screenshot({ path: fileURLToPath(new URL('../clerk-setup.local/embedded-main-entry.png', import.meta.url)), fullPage: true });
    await context.close();
  } finally { await browser.close(); await server.close(); }
});
