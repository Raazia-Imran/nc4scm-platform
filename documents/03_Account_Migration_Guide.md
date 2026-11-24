# NC4SCM Account Migration Guide

24 November 2026 | Asia/Karachi | Version 1.0

## Recommended route and prerequisites

Goal: leave Raazia with her original repositories and visible historical authorship, while the client independently controls production GitHub, Vercel, Sanity, domain and recovery. This is the procedure for a future authorized migration. No account was created, repository copied, domain moved or deployment changed during preparation.

Recommended sequence: prepare client ownership, duplicate Git history, verify the actual hosting/domain map, transfer the existing hosting projects, then reconnect them to the client repositories. Preserve the same public domains and Sanity dataset. A GitHub ownership transfer is unnecessary for the requested two-copy outcome.

Vercel documents project transfer as supporting zero downtime between teams. It requires source-team ownership and destination-team membership. Deployments, domains, Git linkage and ordinary project environment variables transfer; integrations and some service resources need separate handling. Review the actual transfer summary and billing requirements before confirming. A subdomain-only transfer may leave the root domain in the source scope. [1]

### Blocking discrepancy

The connected Vercel account is Raazia's projects (raazias-projects-142c0b42). Its nc4scm-platform and nc4scm-conference domain inventories returned only default vercel.app domains; both custom websites still respond. Do not transfer these projects merely because their names match. First locate which projects/scopes actually own nc4scm.com, www.nc4scm.com and gcgc.nc4scm.com.

### Stage 1 Prepare client accounts

- Client chooses and controls the email, GitHub identity/organization and Vercel workspace; the official conference mailbox is not automatically the login identity. Client retains MFA and recovery codes. Invite Raazia as a temporary collaborator/member where needed.

- Confirm the destination plan, team permissions and any payment requirements before proceeding. Do not assume a migration or institutional site will fit a free plan; no paid action is authorized by this document.

- Create an owner register: GitHub owner, Vercel team/owner, Sanity project and organization owner, Namecheap registrant/recovery contact, Search Console verified owner, enquiry mailbox/provider. Record access confirmation without passwords.

The client reports Namecheap and Search Console already use client accounts. Confirm access and verified ownership rather than creating replacement properties or changing registrar ownership unnecessarily.


## Stage 2 Copy source with authorship

Create two EMPTY standalone repositories under the client GitHub account or organization, with the same names. Do not initialize README, license or .gitignore. Keep Actions disabled on the new platform repository until its import/deployment workflow is reviewed.

The following commands are a future Git Bash procedure. Replace CLIENT_OWNER with the actual approved destination owner; these commands have not been executed. Run from a new temporary folder, authenticate as someone allowed to push to the destination, and verify every URL first. [2]

```bash
git clone --bare https://github.com/Raazia-Imran/nc4scm-platform.git
cd nc4scm-platform.git
git push --mirror https://github.com/CLIENT_OWNER/nc4scm-platform.git
cd ..
git clone --bare https://github.com/Raazia-Imran/nc4scm-conference.git
cd nc4scm-conference.git
git push --mirror https://github.com/CLIENT_OWNER/nc4scm-conference.git
```

Mirror push is appropriate only for the verified empty destination: it can overwrite or delete destination refs. Never run it later against an actively edited client repository. If Git LFS pointers are present, fetch all LFS objects and push them to the destination separately. [2]

### What this preserves and omits

This copies Git history, branches and tags, retaining original commit identities and author metadata. It does not migrate pull requests, issues, repository secrets, Actions execution history, webhooks or protection settings. Keep the original repository as historical evidence and recreate required settings deliberately.

Do not rewrite author emails or squash all history into a new initial commit. GitHub profile attribution depends on the original author email being associated with Raazia's account and the commits being on an eligible branch. A standalone copy is preferable to a fork for the requested contribution visibility; the contribution graph is subject to GitHub rules and is not a promise of doubled counts. [3]

### Verify before hosting changes

Compare source/destination main SHA and branch/tag refs using git ls-remote --heads --tags for both remotes. Set main as the destination default branch. Open older and recent commits on client GitHub and confirm authorship links. Record destination URLs and owner. Freeze edits briefly or reconcile any commits added during the copy.

After handover, make the client repository the production source of truth. Your retained copy is independent: it will not synchronize automatically. Agree on ordinary reviewed updates; never schedule repeated destructive mirror pushes.


## Stage 3 Establish the baseline and CMS ownership

### Record the real production mapping

- For each custom hostname, record owning Vercel team/project, canonical redirect, production deployment and Git SHA, linked repository/branch, root directory, build/output commands, runtime version and environment variable NAMES/scopes. Keep secret values in secure account settings only.

- Save current DNS records and TTLs at the actual authoritative DNS provider. Namecheap may be the registrar while DNS is hosted elsewhere. Preserve MX, SPF, DKIM, DMARC, verification TXT and unrelated subdomains.

- Record working homepage/interior URLs, redirects, downloads, images, robots, sitemap and Search Console verification method. Confirm existing client ownership and a known-good hosting deployment for rollback.

Expected architecture: platform frontend root frontend-ui, Next.js; conference root repository root, Vite output dist. Connected Vercel projects report Node 24.x; platform Studio CI uses Node 22. Actual domain-owning project settings are authoritative and must be inspected rather than assumed.

### Keep the existing Sanity project

A repository or Vercel move does not copy Sanity content. Continue using dxinqb51 / production. Confirm the client can administer the project/organization, billing and recovery. Where ownership needs change, use Sanity management to add the client administrator and move the existing project into the intended organization if appropriate. Sanity requires the relevant administrator privileges. [6]

Before content-affecting work, take an authenticated dataset export including assets and keep it securely with a date and restore instructions. Example, from cms-backend after confirming project/dataset: npx sanity dataset export production nc4scm-production-YYYY-MM-DD.tar.gz. This checkpoint did not export the dataset; its public response file is only a partial evidence snapshot.

Review Studio origins/CORS, members and token scopes. Provision client-controlled least-privilege CI secrets only when required. The copied workflow references SANITY_AUTH_TOKEN and SANITY_CONTENT_WRITE_TOKEN and can write production content. Inspect every importer and completion marker before enabling it; copying secrets and clicking Run blindly is unsafe.

Client acceptance of Studio editing must precede revoking developer credentials. Preserve project ID, dataset, document IDs and Studio routing so existing pages and conference reads continue to work.


## Stage 4 Transfer hosting and reconnect Git

- 1. In the VERIFIED domain-owning Vercel project, open Settings > General > Transfer Project. Select the prepared client workspace and inspect every listed domain, alias and variable. Confirm billing and service prerequisites before authorizing the transfer. [1]

- 2. Migrate both related hosting projects under a coordinated plan. Check apex, www and gcgc ownership together so the client does not depend on a root domain left in the developer scope. Do not first delete or detach a working custom domain.

- 3. After transfer, confirm the current production deployment and public URLs still work. Reauthorize any required integrations. Grant the destination Vercel GitHub integration access to the client repositories.

- 4. In each transferred project, reconnect the client repository, retain main and the recorded root/build/output settings, and compare environment variable names and deployment scopes. A transfer retains the old Git link until changed; production must ultimately build from the client copy.

- 5. Validate a preview from the client repository, including the main site's Sanity content and conference keynote synchronization. Then make one explicitly approved production deployment and check its source SHA against the client repo. Keep the previous deployment available.

- 6. Recheck DNS and domain configuration using values shown by the destination project. A normal project transfer may need no DNS edit. If an edit is required, change only the relevant web record at the authoritative provider; never replace the whole zone or email records.

### If a new hosting project is required instead

Prepare the client project on its temporary hostname with the correct environment and preview protection. Test pages, assets and downloads before cutover. A custom hostname can have conflicting ownership, so follow Vercel's current move/verification flow for the actual projects. Avoid deleting the old site first. This fallback requires a separate reviewed cutover plan; do not promise zero downtime.

### Rollback plan

If a new deployment breaks the site, restore the recorded known-good deployment in the current owning project and check all custom hosts. If Git reconnection causes failed builds, restore the recorded link/settings while fixing the client copy. If DNS changed, restore the recorded prior values and allow for caches. An ownership transfer back needs the necessary memberships/permissions; it is not an instant universal rollback.

Treat code, domain, DNS and CMS rollback separately. A hosting failure does not justify overwriting the Sanity dataset or force-pushing published Git history.


## Stage 5 Google and final acceptance

### Keep the existing Google presence

Do not remove the website from Google. With the same public domains and page URLs, retain the existing Search Console property. Hosting/account changes do not require the Change of Address tool; that tool concerns a change of site address/domain. Preserve the existing verification file, DNS TXT or other verification method. [4,5]

In particular preserve conference public/google6cebf148146998e0.html, the main site's existing verification method, canonical URLs, HTTPS redirects, robots and sitemap. Check production has no preview noindex/blocking header. Use client Search Console to inspect the homepage and representative interior pages and monitor crawl/indexing reports after cutover. Keep any temporary staging host protected from indexing. [4]

### Acceptance checklist

- Client controls GitHub, hosting, Sanity, Namecheap/DNS and account recovery; Search Console shows the intended client verified owner.

- Both custom sites work over HTTPS; apex/www redirect remains correct; interior reloads, images, downloads, 404, robots and sitemap behave as intended.

- Client repository histories retain the original commits; client hosting deployments point to those repositories and expected SHAs. No source remains dependent on the outgoing developer's Git access.

- Client can perform an approved CMS edit and restore it; conference update timing is understood; provider/mailbox delivery is verified only through a separately authorized enquiry test.

- The record contains the actual settings and rollback deployment. Client signs off before developer access, old credentials or integrations are removed. Rotate/revoke only credentials no longer used, after replacement works.

Keep the developer repositories as agreed. Remove developer operational access only when the client can operate independently. Record who accepted the handover and the date; this document does not assert that acceptance occurred.

### Official references checked on 24 November 2026

| Ref | Primary source |
| --- | --- |
| 1 Vercel project transfer | https://vercel.com/docs/projects/transferring-projects |
| 2 GitHub repository duplication | https://docs.github.com/en/repositories/creating-and-managing-repositories/duplicating-a-repository |
| 3 GitHub attribution | https://docs.github.com/en/account-and-profile/how-tos/contribution-settings/troubleshooting-missing-contributions |
| 4 Google hosting move | https://developers.google.com/search/docs/crawling-indexing/site-move-no-url-changes |
| 5 Google Change of Address | https://support.google.com/webmasters/answer/9370220 |
| 6 Sanity project management | https://www.sanity.io/docs/platform-management/projects-organizations-and-billing |

Platform interfaces and plan requirements can change. Recheck these official instructions and the actual account screens before execution. Documentation complete does not mean migration complete.

