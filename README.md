# NC4SCM Platform — Setup & Launch Guide

This repo has two independent projects:

- `cms-backend/` — Sanity Studio v3 (content editing UI)
- `frontend-ui/` — Next.js 14 App Router site (public website)

They deploy separately and talk to each other only over Sanity's API.

## 1. Install dependencies

```bash
cd cms-backend
npm install

cd ../frontend-ui
npm install
```

## 2. Create your Sanity project

```bash
cd cms-backend
npx sanity init
```

Follow the prompts (create a new project, dataset name `production`). This
gives you a **Project ID** — copy it.

## 3. Configure environment variables

**cms-backend/.env** (create this file, it's gitignored by Sanity's default template):

```
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
```

**frontend-ui/.env.local** (already scaffolded — just fill in the values):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
NEXT_PUBLIC_FORM_ENDPOINT=https://formspree.io/f/your_form_id
NEXT_PUBLIC_SITE_URL=https://www.your-domain.org
```

If you set your dataset visibility to "Private" in manage.sanity.io, also
generate a read token (API → Tokens → Add API token, "Viewer" permission)
and set `SANITY_API_READ_TOKEN` in `.env.local`.

## 4. Run both projects locally

```bash
# Terminal 1 — Studio (usually http://localhost:3333)
cd cms-backend
npm run dev

# Terminal 2 — Website (usually http://localhost:3000)
cd frontend-ui
npm run dev
```

Open the Studio and complete the singleton editors first: Global Site
Settings, Home Page, About Page, and Page Headings & Contact. Then create the
repeatable Team Member, Partner, Service, Publication, Event, and News items.
The frontend includes safe empty states until content is published.

## 5. Git setup

```bash
cd nc4scm            # repo root
git init
git add .
git commit -m "Initial commit: NC4SCM platform"
```

Push to GitHub/GitLab as normal (`git remote add origin <url>`, `git push`).

## 6. Deploy the Studio

```bash
cd cms-backend
npx sanity deploy
```

This hosts your Studio at `https://your-project-name.sanity.studio`.

## 7. Deploy the frontend to Vercel

```bash
cd frontend-ui
npx vercel
```

In the Vercel project dashboard, add the same environment variables from
`.env.local` under Settings → Environment Variables, then redeploy
(`npx vercel --prod`).

## 8. Final validation checklist

- [ ] Studio loads at your deployed Studio URL and you can create/edit documents
- [ ] Homepage shows the slogan, service grid, and latest news
- [ ] About page shows team members sorted by priority and partner logos
- [ ] Services page renders all four service portfolios
- [ ] Publications page search box filters results live, and PDF download
      links open the actual uploaded file
- [ ] Events page correctly splits an event dated in the future into
      "Upcoming" and one dated in the past into "Past"
- [ ] Clicking a news card opens `/news/<slug>` with the correct article
- [ ] Contact form submission returns the "Thank You" state (test with a
      real Formspree/Getform endpoint first)
- [ ] Global navigation, footer, contact details, and page headings update
      after publishing changes in Sanity
- [ ] Verify keyboard navigation, mobile menu, reduced-motion behavior,
      sitemap.xml, and robots.txt
- [ ] Run `npm run build` inside `frontend-ui/` locally with zero errors
      before deploying to production
