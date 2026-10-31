// Keep the policy shared between configuration and regression checks.
function httpsOrigin(value) {
  if (!value) return null;
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password) {
    throw new Error('The contact endpoint must use HTTPS without URL credentials.');
  }
  return url.origin;
}
function contentSecurityPolicy(endpoint, development = false) {
  const formOrigin = httpsOrigin(endpoint);
  return [
    "default-src 'self'",
    // Next.js ISR includes changing inline hydration scripts. Request nonces
    // would disable static rendering/ISR. No unsafe-eval in production.
    `script-src 'self' 'unsafe-inline'${development ? " 'unsafe-eval'" : ''}`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://cdn.sanity.io",
    "font-src 'self'",
    `connect-src 'self' https://formsubmit.co${formOrigin ? ' ' + formOrigin : ''}${development ? ' ws: http://localhost:* http://127.0.0.1:*' : ''}`,
    "frame-src https://www.openstreetmap.org https://www.google.com https://maps.google.com",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    `form-action 'self' https://formsubmit.co${formOrigin ? ' ' + formOrigin : ''}`,
    ...(!development ? ['upgrade-insecure-requests'] : []),
  ].join('; ');
}
module.exports = { contentSecurityPolicy, httpsOrigin };
