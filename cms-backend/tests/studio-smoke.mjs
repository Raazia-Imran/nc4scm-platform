// Test the built editor without logging into or writing to the real project.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(new URL('../../frontend-ui/package.json', import.meta.url));
const { chromium } = require('playwright');
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const results = new URL('../../frontend-ui/test-results/', import.meta.url);
const types = {'.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.woff2':'font/woff2'};
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root.endsWith(sep) ? root : root + sep)) {res.writeHead(403);res.end();return;}
    const body = await readFile(file);
    res.writeHead(200, {'Content-Type': types[extname(file)] || 'application/octet-stream'});
    res.end(body);
  } catch {res.writeHead(404);res.end();}
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ headless:true, args:['--no-sandbox','--disable-dev-shm-usage'], ...(process.env.CHROMIUM_EXECUTABLE_PATH ? {executablePath:process.env.CHROMIUM_EXECUTABLE_PATH}: {}) });
  const base = `http://127.0.0.1:${server.address().port}`;
  const providers = [{name:'google',title:'Google',url:'https://api.sanity.io/v1/auth/login/google'}, {name:'sanity',title:'Email / password',url:'https://api.sanity.io/v1/auth/login/sanity'}];
  await mkdir(results, {recursive:true});
  for (const width of [320, 1440]) {
    const page = await browser.newPage({viewport:{width,height:900}});
    const errors = [], writes = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.route('**/*', route => {
      const request = route.request(), url = new URL(request.url());
      if (url.origin === base) return route.continue();
      if (!['GET','HEAD','OPTIONS'].includes(request.method())) writes.push(url.pathname);
      if (url.pathname.endsWith('/auth/providers')) return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({providers})});
      if (url.pathname.endsWith('/users/me')) return route.fulfill({status:401,contentType:'application/json',body:JSON.stringify({error:'Unauthorized'})});
      return route.abort();
    });
    const response = await page.goto(base);
    assert.equal(response.status(),200);
    await page.getByText('Choose login provider', {exact:true}).waitFor();
    assert.ok(await page.getByText('NC4SCM Content Studio', {exact:true}).isVisible());
    assert.ok(await page.getByText('Google', {exact:true}).isVisible());
    assert.ok(await page.getByText('Email / password', {exact:true}).isVisible());
    assert.equal(await page.getByText('An error occurred', {exact:true}).count(),0);
    assert.deepEqual(errors,[]);
    assert.deepEqual(writes,[], 'Editor startup must not write to the real project');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.screenshot({path:fileURLToPath(new URL(`studio-login-${width}.png`,results)),fullPage:true});
    await page.close();
  }
  console.log('PASS: built Studio login at 320px and 1440px; zero browser errors; all external API requests intercepted. Authenticated editing/publishing not exercised.');
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
