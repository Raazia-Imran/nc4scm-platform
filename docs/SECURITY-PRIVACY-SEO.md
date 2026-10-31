# NC4SCM security, privacy and indexing handover

**Studio follow-up:** the 28 outstanding dependency findings in this historical audit have been remediated on `fix/sanity-studio-security`. A clean Studio install now reports zero known vulnerabilities. See [Studio security update](STUDIO-SECURITY-UPDATE.md) for versions, compatibility checks, release status and remaining account checks. The original audit report is retained as baseline evidence.

Audit date: 31 October 2026. Baseline: main `405dc75635ea680bb3d10db4e0c84542b820ea34`.
Scope: this repository’s public Next.js website and Sanity Studio build. The conference portal is a separate application; its live homepage was checked, but its code was not changed. HosH was inspected as a reference, including its live CSP and privacy implementation. Its provider, storage preferences and nonce architecture were not copied wholesale.

## Release status

Changes are prepared on `fix/security-privacy-seo-audit`. Repository implementation, local verification, remote checks and production rollout are separate milestones. Pushing this branch does not establish that the custom domain serves it. No DNS records, Sanity content, authentication settings, email records, Search Console settings or production aliases were changed. No real enquiries were submitted.

## Findings and priorities

The status column describes the baseline. The resolution column describes this branch and remaining work.

| Priority | Area | Baseline classification | Evidence and resolution |
| --- | --- | --- | --- |
| High | Frontend framework/dependencies | Missing or incorrect | Next 14.2.5 and 46 npm audit findings across the original frontend tree. Updated to Next 15.5.28, with async route params; replaced unused next-sanity integration with the already-used @sanity/client 7.23.0. The unused integration pulled Studio and CLI dependencies into the frontend installation. Patched Next’s PostCSS dependency within its 8.x major. Final production dependency audit: zero reported findings. See JSON reports. |
| High | Studio dependencies | Missing or incorrect | Original audit: 43 findings (2 critical, 18 high, 23 moderate). Compatible lockfile updates reduce this to 28 (1 critical, 9 high, 18 moderate). Remaining archive/CLI, glob, zod and other findings require separate remediation and Studio upgrade testing. Do not label this a clean security audit. |
| High | Server token boundary | Implemented but not verified | Token uses a private environment name, but the shared client module was imported by browser image components. Split token-free image building into `src/lib/image-url.js`; `src/sanityClient.js` now imports `server-only`, causing a build failure if imported into browser code. No claim that a token was previously exposed. |
| High | Sanity account permissions, dataset visibility, tokens and CORS | Implemented but not verified | `perspective: published` is set in the read client. Actual project roles, MFA, dataset visibility, token scopes and CORS origins require Sanity management access. Public project IDs and intended published content are not secrets. |
| Medium | CSP | Missing or incorrect | Live baseline had no CSP. Added an enforced resource policy in `next.config.js` and `src/lib/security.cjs`: objects disabled, base restricted, script attributes disabled, same-origin framing, HTTPS resources, explicit map and form origins. See limitations below. |
| Medium | Other browser headers | Implemented and verified | Live baseline: nosniff, SAMEORIGIN, strict-origin-when-cross-origin, camera/microphone/geolocation disabled. Preserved. Hosting supplies HSTS `max-age=63072000`, without includeSubDomains/preload. |
| Medium | External map privacy | Missing or incorrect | Contact HTML loaded OpenStreetMap automatically. New `LocationMap.js` gates an allowlisted HTTPS map behind an explicit action and supports closing it. No persisted permission: the next visit starts off. |
| Medium | Privacy/cookies/terms notices | Missing or incorrect | Added `/privacy`, `/cookies`, `/terms`, footer links, sitemap entries and a form privacy link. Copy describes current providers and actual controls, without invented corporate details, retention deadlines or universal legal promises. Operator review remains required before production release. |
| Medium | Unsafe CMS links | Missing or incorrect | Rich text previously passed arbitrary href values directly to anchors. `safe-url.mjs` rejects executable schemes, HTTP, control characters, protocol-relative URLs and URL credentials. Rich text renders rejected links as text. Other CMS links remain trusted editor content and should be reviewed in Studio. |
| Medium | Contact form | Implemented but not verified | Live client bundle uses existing FormSubmit fallback; custom endpoint was not baked into that bundle. Required fields, length limits, honeypot and success/error state already exist. Preserved provider; added duplicate-submit guard, HTTPS validation, 20-second timeout, no credentials/referrer forwarding, and privacy notice. Real delivery, recipient activation and provider-side abuse settings remain unverified. |
| Medium | Preview indexing/protection | Implemented but not verified | Accessible Vercel project reports SSO protection on all deployments except custom domains. Added X-Robots-Tag and HTML noindex for non-production VERCEL_ENV builds; production remains indexable. These controls do not remove previously indexed copies or cover independent deployments made without Vercel environment flags. |
| Medium | Hosting ownership mapping | Implemented but not verified | Accessible `nc4scm-platform` project reports a READY production deployment, but its returned domain inventory only lists a vercel.app domain. The live custom domain responds successfully. Confirm the custom domain’s actual project/team before any production promotion or DNS change. Do not infer an outage from this inventory discrepancy. |
| Medium | TLS certificate details | Implemented but not verified | HTTPS requests succeed for apex, www and conference host through the available HTTP transport. Direct DNS/TLS socket inspection was unavailable; certificate issuer, SAN coverage, expiry and intermittent warnings are not independently verified. Certificate API returned no entries in the accessible team. This is not proof of failure. |
| Low | HTTP and canonical redirects | Implemented and verified | HTTP apex -> HTTPS apex (308); HTTP www -> HTTPS www (308); HTTPS apex -> HTTPS www (308). Final website 200. No loop observed in these requests. Preferred host remains https://www.nc4scm.com. |
| Low | Robots, sitemap and 404 | Implemented and verified | Live robots and sitemap return 200; robots allows crawling and declares canonical sitemap. Missing URL returned actual 404. Sitemap now includes new notices, rejects malformed dynamic slugs and no longer invents modification times for static pages. |
| Low | Canonical and social metadata | Implemented but not verified | Page canonicals exist. Contact page’s live OG title/description inherited the global values and lacked og:url. Shared `page-metadata.js` now supplies per-page OG/Twitter metadata and canonical OG URLs. New notices have unique metadata. Existing share image preserved; dimensions corrected in layout. |
| Low | Mixed content | Implemented but not verified | Inspected HTML/source integrations use HTTPS; CSP upgrades insecure requests. This is not an exhaustive scan of all future CMS content. Do not publish HTTP media or links. |
| Low | Public authentication/sessions/payments | Not applicable | No public sign-in, payment or application session feature was found. Sanity editor accounts are a separate managed system requiring account review. |
| Low | Visitor analytics/ads and persistent preference storage | Not applicable | No analytics/advertising tag, application cookie setter, localStorage or sessionStorage writer found in public source. Map state is memory-only. Hosting logs and external provider storage are separate. No decorative consent banner was added. |
| Low | Search Console account reports | Implemented but not verified | No authenticated Search Console access was used. Verification ownership, processing, indexing, HTTPS report, manual actions and security issues remain account checks. |
| Low | Structured data | Not applicable | No structured-data eligibility claim is made. Canonical metadata is the implemented baseline; do not invent review ratings, event offers or organizational claims just to populate schema. |

## Security choices and limits

The public site uses static rendering and incremental regeneration. A fresh request nonce would change the rendering/cache model; fixed nonces and hashes computed against changing ISR bodies would be unsafe or break hydration. The policy therefore retains `script-src 'unsafe-inline'` and inline styles for this architecture, restricts external scripts to self and forbids inline script attributes. It is a meaningful baseline policy, not a strict nonce CSP or a complete XSS defence. A stricter policy needs a separate cache/rendering design and validation. Development alone allows eval and local socket connections.

The form endpoint origin is derived from the configured HTTPS environment variable, not a wildcard. The existing FormSubmit origin remains allowed. Map origins are limited to OpenStreetMap and Google Maps; arbitrary CMS iframe hosts are rejected. If a different provider is approved later, update the allowlist, CSP and notices together. Provider cookies cannot be deleted by this origin: closing the embed stops displaying it, and users can clear provider storage in their browser.

No includeSubDomains/preload HSTS was introduced. No restrictive cross-origin isolation header was added without a functional requirement. No CAPTCHA, paid service or replacement form provider was provisioned. Browser-only validation and honeypots are not server-side abuse protection. Confirm provider throttling, spam handling and recipient activation before relying on the form operationally.

The privacy notice names the configured form host when present and FormSubmit otherwise. Retention, data controller contact and applicable jurisdiction must be confirmed by the centre. The terms are informational website-use terms, not a testing contract, event agreement or negotiated limitation of liability.

## Changed files

- `frontend-ui/next.config.js`, `src/lib/security.cjs`: CSP and preview response headers.
- `frontend-ui/src/sanityClient.js`, `src/lib/image-url.js` and image-component imports: server-only token boundary.
- `frontend-ui/src/app/{privacy,cookies,terms}/page.js`, `components/PolicyPage.js`, `components/SiteFooter.js`: notices and footer access.
- `frontend-ui/src/app/components/LocationMap.js`, `contact/page.js`: map choice and withdrawal.
- `frontend-ui/src/app/contact/ContactForm.js`: form request controls and privacy link.
- `frontend-ui/src/lib/safe-url.mjs`, `components/RichTextRenderer.js`: safe rich-text links.
- `frontend-ui/src/lib/page-metadata.js`, page metadata functions, layout and sitemap: search/social consistency.
- Both package lockfiles, frontend package manifest: reviewed dependency updates; Studio major version preserved.
- `frontend-ui/tests/{security.test,responsive}.mjs`, `.eslintrc.json`, GitHub check workflow: regression checks and lint.
- `.gitignore`, `frontend-ui/.env.example`: ignore all environment variants and document non-secret configuration.

## Account checks and manual actions

1. In Vercel, locate the project that actually owns `www.nc4scm.com` and `nc4scm.com`. Confirm team ownership, linked repository, root directory `frontend-ui`, production branch, build command and environment variables. Compare against the accessible project discrepancy above. Record current values before changes.
2. In the owning project’s Domains panel, verify valid configuration for both apex and www and certificate renewal/expiry. Check certificate SANs with a real browser’s certificate viewer. Preserve the existing 308 redirects. Check the conference hostname separately. Do not add HSTS includeSubDomains until every affected hostname is reviewed.
3. Preserve DNS MX, TXT, SPF, DKIM, DMARC and verification records. This branch requires no DNS change. If later required, export the zone first, record old/new values and TTL, and restore those values to roll back.
4. In Sanity Manage for the existing project, review members/roles and MFA, public/private dataset intent, and API tokens. Public reads should not contain private enquiries or drafts. Remove unused credentialed CORS origins only after recording the current list and checking the Studio origin. Keep write tokens in protected hosting/CI secrets with minimum privileges. Do not paste them in reports or commits.
5. In Search Console choose domain property `sc-domain:nc4scm.com`. Confirm a centre-owned verified owner; retain its existing DNS TXT verification. Submit `https://www.nc4scm.com/sitemap.xml` if not already submitted and review the processing result. Do not create a duplicate token or delete an existing one.
6. Use URL Inspection for the homepage, contact page and one article; run Test Live URL, compare user-declared and Google-selected canonicals and crawl eligibility. Review Page Indexing, HTTPS, Security Issues and Manual Actions. Request indexing for eligible changed pages if useful. Processing time and inclusion are not guaranteed. A pending HTTPS report is not proof of a broken certificate.
7. Confirm the actual form processor, recipient activation, spam controls, retention and account ownership. Authorize one controlled delivery test when ready; this audit deliberately does not send email. Keep the visible direct-email fallback.
8. Review public notices with the centre: actual controller/contact, retention practices, processing locations and any audience-specific legal requirements. Update notices/controls before adding analytics, CAPTCHA, video or other tracking integrations.
9. Prioritize a supported Studio dependency upgrade and retest actual editor login, publish, image uploads and content queries in a preview. Audit reports identify remaining findings. Archive extraction tooling should not process untrusted archives while outstanding archive vulnerabilities remain.

## Release and rollback

Review the branch diff and exact commit CI/deployment statuses. Validate the preview at mobile and desktop widths, keyboard controls, map off/load/close/reset, mock form failure/success, notices, headers, 404, robots, sitemap and social metadata. Do not equate a successful branch push with production verification.

Merge only after required checks and preview review. For the actual custom-domain project, stage and test the production-configured build before promotion where hosting supports it. After release repeat live redirect/header/indexing checks and inspect hosting errors. If a release breaks the site, restore the previous READY production deployment in the correct project and verify the domain. Vercel rollback may suspend automatic production assignment until a later promotion.

For source rollback, use a new `git revert <security-change-commit>` commit through the normal review process. Do not reset or force-push published history. Repository changes do not require a Sanity content rollback or DNS rollback because neither was modified. If only the CSP blocks a newly approved integration, revert or narrow that change through a new reviewed commit instead of disabling all security controls.

## Official references

- https://nextjs.org/blog/nextjs-security-update-october-14-2026
- https://nextjs.org/support-policy
- https://nextjs.org/docs/app/guides/content-security-policy
- https://www.sanity.io/docs/content-lake/keeping-your-data-safe
- https://www.sanity.io/docs/content-lake/cors
- https://www.sanity.io/docs/help/js-client-browser-token
- https://vercel.com/docs/deployments
- https://formsubmit.co/

## Verification checklist

Results are updated after the final local/remote checks. A dependency scan is a dated list of known advisories, not proof of complete security. Browser tests use CMS and email fixtures rather than real deliveries.

| Check | Status | Evidence / limitations |
| --- | --- | --- |
| Frontend production build | Tested locally: passed | Next 15.5.28; 35 generated pages including CMS detail fixtures and all three notices. Static generation and 60-second regeneration retained. |
| Frontend lint | Tested locally: passed | No ESLint warnings or errors. Next lint deprecation is tooling notice, not a lint failure. |
| Focused security tests | Tested locally: passed | 3 checks covering malicious rich-text URLs, production CSP/config validation, and preview headers versus production. |
| Browser regression | Tested locally: passed | 286 route/width combinations (22 routes, 13 widths, 280–2560px); filters, menus, forms, newly published CMS detail page and media. Zero JavaScript page errors. |
| Privacy controls | Tested locally: passed | No iframe/request before map activation; keyboard Enter loads it; close removes it; reload resets it; no application cookies/localStorage/sessionStorage in the fixture context. Third-party provider storage after real activation was not measured. |
| Contact delivery states | Tested locally: passed | Intercepted provider failure/success; no real email sent. Actual recipient activation/delivery remains unverified. |
| Visual review | Tested locally: passed | Mobile contact screenshot reviewed; existing design and responsive layout retained. Policy pages also pass responsive route/width tests. |
| Sanity content regression | Tested locally: passed | 17 existing content/import checks after compatible lockfile updates. No actual CMS import or publish executed. |
| Studio build | Tested locally: passed | Sanity production build after compatible lockfile updates. Account login/publish interaction remains unverified. Generated runtime build files excluded from commit. |
| Production dependency audit | Tested locally: passed | Frontend: 0 findings. Full frontend tree has 18 moderate development-tooling findings. Studio has 28 outstanding findings (1 critical, 9 high, 18 moderate); this is an open remediation item. JSON reports retained alongside this document. |
| HTTPS/redirects/robots/sitemap/404 | Verified on production: baseline only | Live response snapshot retained. Branch changes have not been promoted. Certificate expiry/SANs unavailable through direct socket inspection. |
| Remote exact-commit CI / preview | Requires remote result | Inspect the pull request Checks and Vercel deployment for the final commit. Local passes do not substitute for these checks. |
| Search Console / DNS / Sanity permissions | Requires account review | Manual instructions above; no configuration changes or verified account reports claimed. |
| Production rollout | Pending | Review and test the preview, resolve the actual domain/project mapping, then use the existing release process. |

Local environment note: the current Playwright Chromium download endpoint returned invalid archive content. Browser testing therefore used a successfully downloaded Chromium 134 headless shell via `CHROMIUM_EXECUTABLE_PATH`, controlled by the pinned Playwright package. The runner bound Next to 127.0.0.1 because the container cannot enumerate public network interfaces. CI should use its normal supported Chromium download and must be checked independently. No environment workaround changes production behavior.

Before release, treat remaining Studio archive-tool vulnerabilities and legal/operator notice review as explicit outstanding decisions. This branch improves the application but does not claim complete security, legal compliance, guaranteed indexing, or a production deployment.
