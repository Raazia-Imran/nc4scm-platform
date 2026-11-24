# NC4SCM Client User Manual

24 November 2026 | Asia/Karachi | Version 1.0

## Access and everyday editing

For the centre staff who maintain website content. Use Sanity to edit the main NC4SCM site. The GCGC conference site has a smaller CMS connection and still needs a developer for most changes. This manual follows the current repository schemas; your account permissions and the deployed editor version must be confirmed during handover.

| Service | Open this link |
| --- | --- |
| Website | https://www.nc4scm.com |
| Conference | https://gcgc.nc4scm.com |
| CMS editor | https://nc4scm-admin.sanity.studio |
| Sanity project management | https://www.sanity.io/manage/project/dxinqb51 |
| Sanity account dashboard | https://www.sanity.io/@ockpUZMTG |
| Embedded Studio | https://www.sanity.io/@ockpUZMTG/studio/wr6t87lt017qmzeuf553rqra/default/structure |
| Search Console | https://search.google.com/search-console?resource_id=sc-domain%3Anc4scm.com |
| Domain registrar | https://ap.www.namecheap.com |

The CMS editor link was observed redirecting to Sanity sign-in. Sign in with the account invited to this existing project. The dashboard and embedded Studio links are retained from project notes; their authenticated contents were not inspected. The registrar and Search Console require the client account.

### Publish a normal content change

- 1. Open the CMS editor and choose the relevant section. Search for the existing item before creating a new record.

- 2. Edit only the approved text, dates, links or image. Review image alternative text and any required fields.

- 3. Sanity saves draft edits. Review the record, resolve validation messages and use Publish when approved. Draft saving alone does not update the public site.

- 4. Open the changed public page and refresh after about a minute. Caching can take longer; allow a few minutes before asking the maintainer to investigate.

- 5. Record the page, change and approval. If something is wrong, correct the same record and republish. Ask the maintainer for recovery if the original value is unknown; available history depends on the account plan.

Do not store private identity numbers, payroll data or passwords in content fields. A hidden item in a public dataset is not private storage.


## Where to edit website content

| What changes | Sanity section and action |
| --- | --- |
| Logo, navigation, footer, address, email, phone | Global Site Settings. Review public contact permission before publishing. Website interface text controls labels, buttons and form messages. |
| Homepage text and image | Home Page: Hero headline, Hero introduction, Hero image and action links; lower sections have their own headings/copy. |
| Mission, vision, story and journey | About Page. Expand Journey Timeline for milestones and photographs. Each new milestone photograph needs alternative text and caption. |
| Page titles and introductions | Page Headings & Contact. Use this for section introductory copy and contact success copy. |
| Team biographies and links | Team Member. Edit the existing person; see the following page. |
| Services and partner logos | Service or Partner records. Preserve existing slugs unless a URL change is approved. |
| Publication | Publication: paper title, slug, type, year, category, authors and venue; add DOI and an authorized distributable PDF when available. |
| News article | News Article: Headline, Slug, Category, Card preview (up to 220 characters), Published Timestamp, graphic/gallery and Article Body. |
| Event and recap | Event: Title, Slug, Event Type, Event Date & Time, venue and description. Use Dates only when a time is not announced; add end date, galleries and recap when approved. |
| Archive introduction | Centre Archive page. Its public URL is /legacy. |
| Past projects and practical teams | Legacy project / Practical contribution. Complete the required fields, enable Approved for public display, then publish. |

### Photos and documents

Use approved original images with clear filenames. Alternative text describes the image; captions identify the event/context. Confirm permission before uploading portraits or publication PDFs. Avoid deleting an asset until a maintainer checks whether another page uses it.

Keep existing slugs for existing news, events, services and archive projects. A slug affects the public URL; changing one can break shared links and require a redirect.


## People and Centre Archive

### Add a team member

- 1. Search by name first. Create a Team Member only if no existing record represents this person.

- 2. Enter the approved Full Name, Position / Role, Team group and Slug. Include an approved honorific. Set Display Priority to a non-negative whole number; lower values sort first within the appropriate group.

- 3. Add a short third-person directory summary (maximum 400 characters), qualification summary, full Biography and up to six research interests.

- 4. Upload the approved white-background portrait and alternative text, or select the neutral/female illustration. Do not invent a portrait.

- 5. Add approved public email, LinkedIn, GitHub, official academic profile, ORCID, Google Scholar or ResearchGate links as applicable. Leave unknown information blank.

- 6. Publish after approval, then review the About page, full biography, links and portrait.

### When someone leaves

Edit the existing profile. Set Contract end date to the final active day, or choose Contract ended for an immediate change. Publish. The end date includes the whole day in Pakistan time. The profile can then appear in Centre Archive with its biography preserved; no new person record is needed.

Use Keep lasting credit on the main team page only when an ongoing contribution credit is intended. It labels the contribution without claiming current employment. Hide from public team directory hides the person from both public directories and takes precedence; it is different from ending a contract.

### Add a past project

Create a Legacy project with title, slug, category, completion year and summary. Add the real team, supervisors, outcomes, story and approved captioned photographs. Switch on Approved for public display only after review, then publish. Practical contributions use a separate record for technicians, craftspeople or practical teams.

### Journey photographs

About Page > Journey Timeline > selected milestone > Milestone photographs. Add caption and alternative text; publish About Page. Visitors reach the year through Events > Journey in pictures. Years without real photographs should remain empty.


## Conference updates and support

### What Sanity changes on GCGC

Events > Global Conference on Green Construction Materials and Practices 2027 > Keynote speaker profiles. Publish approved profile changes, then ask the maintainer to rebuild/redeploy the conference site. The main site and conference site have different update timing.

Current published event dates are 16-17 April 2027, dates only. Published keynote names are Dr. Fernando Martirena and Dr. Sofía Sánchez Berriel. Do not invent keynote times, session titles, fees or venue details.

### What needs a developer

Conference poster, most conference page text, dates/countdown/metadata, programme, fees, downloads and route changes are maintained in the conference repository. Sending an image to Sanity does not replace its static poster. Submit the page name, exact approved content, original asset/link and approving person to the maintainer.

| Problem | First action |
| --- | --- |
| Cannot sign in or edit | Check the invited account and ask the client administrator to confirm project membership/role. Do not share passwords. |
| Published edit is missing | Check you published the correct record; allow caches to refresh. For keynote changes confirm a conference rebuild succeeded. |
| Person disappeared | Review hide flag, contract status and end date, then check Centre Archive. |
| Archive project is missing | Confirm required content, approval switch and Publish; an unapproved project is intentionally excluded. |
| Image or link is wrong | Correct the original record and republish; preserve the public URL where possible. |
| Enquiry is not received | Check the official inbox/spam and ask the maintainer to verify the provider activation. A success screen is not mailbox proof. |
| Website or domain fails | Send the exact URL, time and error to the maintainer. Do not delete DNS, Search Console verification or hosting projects. |

### Client handover acceptance

Before final sign-off, the client should demonstrate: sign in; edit/publish one approved small change; upload an approved image; find a member and archive record; access GitHub, hosting, Namecheap and Search Console; restore the previous text; locate account recovery and support details. These are acceptance steps to perform, not tests claimed completed.

Source: current platform schemas, Studio configuration, Centre Archive guide and GCGC guide at the repository commits in 01_Developer_Handover.pdf. Administrator access, final approvals and live editor publishing remain to be confirmed. Version 1.0 - 24 November 2026.

