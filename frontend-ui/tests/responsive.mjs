import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { readFile, mkdir, writeFile, readdir } from "node:fs/promises";
import assert from "node:assert/strict";
import { createFixture } from "../../cms-backend/tests/sanity-fixture.mjs";
import { verifyNewsEditor } from './news-editor.mjs';
const { chromium } = createRequire(import.meta.url)("playwright");
const fixture = await createFixture();
fixture.docs.push(
 {_id:"team-digital-fixture",_type:"teamMember",fullName:"Website Maintainer",position:"Website and CMS Developer",group:"digital-platforms",displayPriority:500,cardSummary:"Maintains the centre website and conference platform.",portraitPlaceholder:"neutral"},
 {_id:"team-finance-fixture",_type:"teamMember",fullName:"Finance Member",position:"Finance",group:"finance",displayPriority:600,portraitPlaceholder:"neutral"}
);
const env = {
  ...process.env,
  NEXT_PUBLIC_SANITY_PROJECT_ID: "dxinqb51",
  NEXT_PUBLIC_SANITY_DATASET: "production",
  SANITY_API_HOST: fixture.host,
  NEXT_TELEMETRY_DISABLED: "1",
};
const cwd = new URL("../", import.meta.url);
const run = (args) =>
  new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { cwd, env, stdio: "inherit" });
    child.on("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`Command failed: ${args.join(" ")} (${code})`)),
    );
  });
let server, browser;
try {
  await run(["node_modules/next/dist/bin/next", "build"]);
  server = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", "3100"],
    { cwd, env, stdio: "inherit" },
  );
  for (let i = 0; i < 100; i++) {
    try {
      const response = await fetch("http://127.0.0.1:3100");
      if (response.ok) break;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"], ...(process.env.CHROMIUM_EXECUTABLE_PATH ? {executablePath:process.env.CHROMIUM_EXECUTABLE_PATH} : {}) });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const logo = await readFile(
    new URL("../public/media/brand/nc4scm-logo.webp", import.meta.url),
  );
  const photo = await readFile(
    new URL(
      "../public/media/news/gcgc-2025-structural-demo.jpg",
      import.meta.url,
    ),
  );
  const poster = await readFile(new URL("../../cms-backend/seed/october-2026-media/gcgc-2027-poster.jpg", import.meta.url));
  const media = [];
  for (const file of await readdir(new URL('../../cms-backend/seed/news-media/',import.meta.url)))
    media.push({key:file.replace('.jpg','').replace(/[^a-z0-9]/g,''),body:await readFile(new URL('../../cms-backend/seed/news-media/'+file,import.meta.url)),type:'image/jpeg'});
  media.push({key:'fayazhussain',body:await readFile(new URL('../../cms-backend/seed/team-media/fayaz-hussain.png',import.meta.url)),type:'image/png'});
  for (const file of ['bestway-cement.jpeg','cherat-cement.jpeg','power-cement.png'])
    media.push({key:('partner-'+file.replace(/\.(jpeg|png)$/,'')).replace(/[^a-z0-9]/g,''),body:await readFile(new URL('../public/media/partners/'+file,import.meta.url)),type:file.endsWith('.png')?'image/png':'image/jpeg'});
  await page.route("**/_next/image?**", route => {
    if (route.request().url().includes("poster-1013x1800")) return route.fulfill({contentType:"image/jpeg",body:poster});
    const matching = media.find(item=>route.request().url().includes(item.key+'-800x600'));
    return route.fulfill({contentType:matching?.type || (route.request().url().includes('logo')?'image/webp':'image/jpeg'),body:matching?.body || (route.request().url().includes('logo')?logo:photo)});
  });
  const paths = [
    "/",
    "/about",
    "/services",
    "/publications",
    "/events",
    "/news",
    "/contact",
    "/privacy",
    "/cookies",
    "/terms",
    ...fixture.docs
      .filter((d) => d._type === "service")
      .map((d) => "/services/" + d.slug.current),
    ...fixture.docs
      .filter((d) => d._type === "event")
      .map((d) => "/events/" + d.slug.current),
    "/news/dr-tariq-jamil-iep-fellowship-2026",
    "/news/nc4scm-lc3-keynote-icssc-2026",
    "/news/student-seminar-lc3-cement-chemistry-2026",
    "/news/portrait-poster",
  ];
  const widths = [280, 320, 375, 414, 600, 768, 1024, 1280, 1366, 1440, 1536, 1920, 2560];
  await mkdir(new URL("../test-results/", import.meta.url), {
    recursive: true,
  });
  const results = [];
  for (const width of widths) {
    await page.setViewportSize({ width, height: width >= 1024 && width <= 1536 ? 768 : 900 });
    for (const path of paths) {
      const response = await page.goto("http://127.0.0.1:3100" + path, {
        waitUntil: "networkidle",
      });
      assert.equal(response.status(), 200, `${width}px ${path} status`);
      assert.deepEqual(errors, [], `${width}px ${path} browser errors`);
      const dimensions = await page.evaluate(() => ({
        width: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
      }));
      assert.ok(
        Math.max(dimensions.scroll, dimensions.body) <= dimensions.width + 1,
        `${width}px ${path} overflows: ${JSON.stringify(dimensions)}`,
      );
      assert.ok(
        !(await page.getByText("Application error:", { exact: false }).count()),
        `${path} server error`,
      );
      if (width >= 1024) {
        const hero = page.locator(".page-hero");
        if (await hero.count()) {
          assert.ok(await hero.evaluate((element) => element.getBoundingClientRect().height) <= 460, `${path} desktop hero too tall`);
          assert.ok(await page.locator("h1").evaluate((element) => parseFloat(getComputedStyle(element).fontSize)) <= 52, `${path} oversized title`);
        }
        if (path === "/about") {
          const portraits = page.locator(".team-portrait");
          for (const portrait of await portraits.all()) {
            const box = await portrait.boundingBox();
            assert.ok(box.width <= 300 && box.height <= 320, "Team portrait should not fill the desktop row");
          }
        }
      }
      for (const image of await page.locator(".content-image-preview").all()) {
        const size = await image.evaluate(img => ({width: img.clientWidth, height: img.clientHeight, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight, viewportHeight: innerHeight, fit: getComputedStyle(img).objectFit}));
        assert.ok(size.height <= Math.min(480, size.viewportHeight * .6) + 2, `${width}px ${path} cover exceeds compact height`);
        assert.equal(size.fit, "contain");
        if (size.naturalWidth && size.naturalHeight) assert.ok(Math.abs(size.width / size.height - size.naturalWidth / size.naturalHeight) < .03, `${width}px ${path} image stretched`);
      }
      if (path.startsWith("/news/")) {
        const back = page.locator('.detail-return-bar a[href="/news"]');
        assert.equal(await back.count(), 1, `${path} needs a bottom return link`);
        assert.ok((await back.boundingBox()).height >= 44, "Return link touch target");
        const content = await page.locator('main article').boundingBox();
        const navigation = await page.locator('.detail-return-bar').boundingBox();
        assert.ok(navigation.y >= content.y + content.height - 1, "Return link must follow article content");
      }
      if(path==='/about'){
        const cards=await page.locator('.team-profile-card').evaluateAll(elements=>elements.map(el=>({height:el.clientHeight,white:getComputedStyle(el.querySelector('.team-portrait')).backgroundColor,summaryHeight:el.querySelector('.team-profile-summary').clientHeight,summaryScrollHeight:el.querySelector('.team-profile-summary').scrollHeight})));
        const groupedHeights=await page.locator('.team-directory-grid').evaluateAll(grids=>grids.map(grid=>Array.from(grid.querySelectorAll('.team-profile-card'),el=>el.clientHeight)));
        assert.ok(groupedHeights.every(heights=>Math.max(...heights)-Math.min(...heights)<2),'Consistent tile height within each role group');
        assert.equal(await page.locator('.team-level').count(),5,'All five role groups rendered');
        for(const card of await page.locator('.team-level-single .team-profile-card').all()){
          assert.ok(await card.evaluate(el=>el.clientWidth<=832),'Single role cards stay compact');
        }
        assert.ok(cards.every(x=>x.white==='rgb(255, 255, 255)' && x.summaryScrollHeight<=x.summaryHeight+1),'White portraits and fully visible summaries without clipping');
        const first=page.locator('.team-profile-actions button').first();await first.click();
        const modal=page.getByRole('dialog');await modal.waitFor({state:'visible'});
        const box=await modal.boundingBox();assert.ok(box.width<=width && box.height<=900,'Responsive profile dialog');
        await page.keyboard.press('Escape');
      }
      results.push({ width, path, status: response.status(), overflow: false });
      if (
        (width === 375 || width === 1440) &&
        ["/", "/services", "/about", "/news", "/publications", "/events", "/contact", "/events/gcgc-2025", "/services/lc3-technology"].includes(
          path,
        )
      )
        await page.screenshot({
          path: new URL(
            `../test-results/${path.slice(1).replaceAll("/", "-") || "home"}-${width}.png`,
            import.meta.url,
          ).pathname,
          fullPage: true,
        });
    }
    console.log(`Verified ${paths.length} routes at ${width}px`);
  }
  await page.goto("http://127.0.0.1:3100/");
  assert.equal(await page.locator(".home-institutions").count(), 0);
  assert.equal(await page.getByText("NRPU Project No. 14074", {exact:true}).count(), 0);
  assert.ok(await page.locator(".home-news-preview").count() <= 2);
  assert.equal(await page.locator(".home-experience").count(), 1);
  const homeLayout=await page.evaluate(()=>({eventHeight:document.querySelector('.home-events').getBoundingClientRect().height}));
  assert.ok(homeLayout.eventHeight<500, "Empty event box stays content-sized");
  await page.goto("http://127.0.0.1:3100/about");
  assert.deepEqual(await page.locator('.team-profile-card h4').allTextContents(), fixture.docs.filter(d=>d._type==='teamMember').sort((a,b)=>a.displayPriority-b.displayPriority).map(d=>d.fullName));
  assert.equal(await page.locator('.team-portrait-empty').count(),4);
  assert.ok(await page.locator('.partner-logo-image').count() >= 3);
  for (const img of await page.locator('.partner-logo-image').all()) {
    const source = new URL(await img.getAttribute('src'),'http://127.0.0.1:3100').searchParams.get('url');
    assert.ok(!new URL(source).searchParams.has('rect'), 'Logo processing retains the complete asset');
    assert.equal(await img.evaluate(element=>getComputedStyle(element).objectFit),'contain');
  }
  const contactAlignment = await page.locator(".team-profile-card").evaluateAll(cards => cards.map(card => {
    const email=card.querySelector('.email-actions a'), linkedin=card.querySelector('a[href*="linkedin"]');
    return !email || !linkedin || Math.abs(email.getBoundingClientRect().y-linkedin.getBoundingClientRect().y)<2;
  }));
  assert.ok(contactAlignment.every(Boolean), "Email and LinkedIn align on the same row");
  const profileButton=page.locator('.team-profile-actions button').first();
  await profileButton.click();
  await page.getByRole('dialog').waitFor({state:'visible'});
  assert.ok(await page.locator('#team-dialog-name').innerText());
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').isVisible(),false);
  assert.equal(await profileButton.evaluate(el=>el===document.activeElement),true,'Focus returns to opener');
  await page.locator('.team-profile-card').filter({hasText:'Dua Arif'}).getByRole('button').click();
  assert.equal(await page.getByRole('dialog').locator('.email-actions').count(),1,'Full profile has one email action');
  assert.equal(await page.getByRole('dialog').getByRole('link',{name:/@/}).count(),0,'Email addresses are not exposed as duplicate link labels');
  await page.keyboard.press('Escape');

  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("http://127.0.0.1:3100/news");
  const articleCard = page.locator('.news-card').first();
  assert.ok((await articleCard.getAttribute('href')).startsWith('/news/'));
  assert.equal(await articleCard.getAttribute('target'),null);
  await articleCard.click();
  await page.waitForURL('**/news/student-seminar-lc3-cement-chemistry-2026');
  assert.ok(await page.getByText('A student seminar on LC3 and cement chemistry', {exact:false}).count());
  assert.ok(await page.locator('a[href*="7502736757143134208"]').count());
  await page.getByRole('button',{name:'Next photo',exact:true}).click();
  await page.locator('.gallery-controls [role="status"]').getByText('2 / 2',{exact:true}).waitFor();
  await page.goto("http://127.0.0.1:3100/news");
  await page.getByRole("button", { name: "Recognition", exact: true }).click();
  assert.equal(await page.locator("main a.premium-card").count(), 1);
  await page.getByRole("button", { name: "All news", exact: true }).click();
  assert.ok((await page.locator("main a.premium-card").count()) > 1);
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  assert.equal(await page.locator("#mobile-navigation").count(), 1);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#mobile-navigation").count(), 0);
  await page.goto("http://127.0.0.1:3100/publications");
  const input = page.getByRole("searchbox");
  await input.fill("no-matching-paper-fixture");
  assert.equal(await page.locator("main article").count(), 0);
  await input.fill("");
  await page
    .getByRole("button", { name: "Filter by year:", exact: false })
    .click();
  const chosen = page.locator('[role="option"]').nth(1);
  await chosen.click();
  assert.ok((await page.locator("main article").count()) > 0);
  await page.goto("http://127.0.0.1:3100/events");
  await page.getByRole("button", { name: "Past", exact: true }).click();
  assert.ok((await page.locator("main a.premium-card").count()) > 0);
  const galleryEvent = fixture.docs.find((doc) => doc._type === "event" && doc.gallery?.length > 1);
  await page.goto("http://127.0.0.1:3100/events/" + galleryEvent.slug.current);
  await page.getByRole("button", { name: "Next photo", exact: true }).click();
  await page.getByText("Second fixture caption", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Next photo", exact: true }).click();
  await page.getByText("Local fixture caption", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Previous photo", exact: true }).click();
  await page.getByText("Second fixture caption", { exact: true }).waitFor();
  await page.getByText("Fixture outcome one", { exact: true }).waitFor();
  await page.goto("http://127.0.0.1:3100/services/lc3-technology");
  assert.equal(await page.locator("details.service-overview").count(), 0);
  assert.ok(await page.locator(".service-overview").innerText());
  await page.locator(".detail-return-bar").scrollIntoViewIfNeeded();
  assert.ok(await page.locator(".detail-return").isVisible());
  const returnBox=await page.locator(".detail-return-bar").boundingBox();
  const consultationBox=await page.locator(".service-contact .button").boundingBox();
  assert.ok(returnBox.y>=consultationBox.y+consultationBox.height, "Return navigation never overlaps consultation CTA");
  await Promise.all([
    page.waitForURL("http://127.0.0.1:3100/services"),
    page.locator(".detail-return").click(),
  ]);
  assert.ok(page.url().endsWith("/services"));
  await page.goto("http://127.0.0.1:3100/publications");
  assert.equal(await page.locator(".compact-text details").count(), 0);
  await page.goto("http://127.0.0.1:3100/about");
  const heights = await page.locator(".team-profile-card").evaluateAll(cards => cards.map(card => card.getBoundingClientRect().height));
  assert.ok(heights.every(height=>height>0), "All team cards remain visible");
  assert.equal(await page.locator('a[href^="mailto:"]').count(), 0);
  // External maps require a fresh action on every visit and support withdrawal.
  const mapRequests = [];
  await page.route('https://www.openstreetmap.org/**', route => {
    mapRequests.push(route.request().url());
    return route.fulfill({contentType:'text/html', body:'<html><body>Local map fixture</body></html>'});
  });
  await page.goto('http://127.0.0.1:3100/contact');
  assert.equal(await page.locator('iframe').count(), 0);
  assert.equal(mapRequests.length, 0, 'No map request before choice');
  await page.getByRole('button', {name:'Load location map'}).focus();
  await page.keyboard.press('Enter');
  await page.locator('iframe').waitFor();
  assert.equal(await page.locator('iframe').count(), 1);
  await page.getByRole('button', {name:'Close map'}).click();
  assert.equal(await page.locator('iframe').count(), 0);
  await page.reload();
  assert.equal(await page.locator('iframe').count(), 0);
  assert.deepEqual(await page.evaluate(() => ({local:localStorage.length, session:sessionStorage.length})), {local:0, session:0});
  assert.equal((await page.context().cookies()).length, 0);
  const headers = (await page.request.get('http://127.0.0.1:3100/contact')).headers();
  assert.ok(headers['content-security-policy'].includes("object-src 'none'"));
  assert.equal((await page.request.get('http://127.0.0.1:3100/audit-missing')).status(), 404);
  const sitemap = await (await page.request.get('http://127.0.0.1:3100/sitemap.xml')).text();
  for (const path of ['/privacy', '/cookies', '/terms']) assert.ok(sitemap.includes('https://www.nc4scm.com'+path));
  await page.goto("http://127.0.0.1:3100/contact?service=lc3-technology");
  assert.equal(
    await page.getByLabel("Selected service", { exact: true }).inputValue(),
    "LC3 Technology",
  );
  const gmailLinks = page.locator('a[href^="https://mail.google.com/mail/"]');
  assert.ok(await gmailLinks.count() >= 3, "Centre and both contacts have Gmail compose links");
  for (const link of await gmailLinks.all()) {
    const url = new URL(await link.getAttribute("href"));
    assert.ok(url.searchParams.get("to").includes("@"));
    assert.equal(await link.getAttribute("target"), "_blank");
  }
  const mockEmail = (success) => (route) =>
    route.fulfill({
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "content-type,accept",
      },
      contentType: "application/json",
      body: JSON.stringify({ success }),
    });
  await page.route("https://formsubmit.co/**", mockEmail("false"));
  await page.getByLabel("Name", { exact: true }).fill("Local test");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page
    .getByLabel("Message", { exact: true })
    .fill("Local test only; intercepted, never delivered.");
  await page
    .getByRole("button", { name: "Send an enquiry", exact: false })
    .click();
  await page.getByRole("alert").waitFor();
  await page.unroute("https://formsubmit.co/**");
  await page.route("https://formsubmit.co/**", mockEmail("true"));
  await page
    .getByRole("button", { name: "Send an enquiry", exact: false })
    .click();
  await page
    .getByText(
      "The enquiry has been received by NC4SCM.",
      { exact: true },
    )
    .waitFor();
  assert.deepEqual(errors, []);
  await verifyNewsEditor(page,fixture,'http://127.0.0.1:3100');
  await writeFile(
    new URL("../test-results/responsive.json", import.meta.url),
    JSON.stringify(
      { routes: results, interactionChecks: "passed", browserErrors: errors },
      null,
      2,
    ),
  );
  console.log(
    `PASS: ${results.length} route/width checks, filter/menu/form interactions, zero browser errors. CMS responses and email delivery were local fixtures.`,
  );
} finally {
  await browser?.close();
  server?.kill("SIGTERM");
  await fixture.close();
}
