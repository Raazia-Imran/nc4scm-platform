import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { safeHref } from '../src/lib/safe-url.mjs';
const require = createRequire(import.meta.url);
const { contentSecurityPolicy, httpsOrigin } = require('../src/lib/security.cjs');
test('CMS rich text rejects executable, protocol-relative and obfuscated URLs', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,test', '//evil.test', 'https://user:pass@evil.test', 'java\nscript:alert(1)', '/\\evil.test', 'http://insecure.test']) assert.equal(safeHref(value), null, value);
  for (const value of ['/news/example', '#main-content', 'https://orcid.org/123', 'mailto:centre@example.org', 'tel:+922112345678']) assert.equal(safeHref(value), value);
});
test('production CSP limits resources without breaking ISR hydration', () => {
  const policy = contentSecurityPolicy('https://formspree.io/f/example');
  for (const directive of ["object-src 'none'", "base-uri 'self'", "script-src-attr 'none'", "frame-ancestors 'self'", "https://formspree.io"]) assert.ok(policy.includes(directive));
  assert.ok(!policy.includes('unsafe-eval'));
  assert.ok(!policy.includes('https:;'));
  assert.throws(() => httpsOrigin('http://example.org/form'));
  assert.throws(() => httpsOrigin('https://user:password@example.org/form'));
});
test('preview exclusion is independent of production crawlability', async () => {
  const original = process.env.VERCEL_ENV;
  try {
    for (const environment of ['production', 'preview', 'development']) {
      process.env.VERCEL_ENV = environment;
      delete require.cache[require.resolve('../next.config.js')];
      const headers = (await require('../next.config.js').headers())[0].headers;
      assert.equal(headers.some(x => x.key === 'X-Robots-Tag'), environment !== 'production');
    }
  } finally { if (original === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = original; }
});
