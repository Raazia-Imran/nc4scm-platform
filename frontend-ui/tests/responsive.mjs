import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { createFixture } from "../../cms-backend/tests/sanity-fixture.mjs";
const { chromium } = createRequire(import.meta.url)("playwright");
const fixture = await createFixture();
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
    ["node_modules/next/dist/bin/next", "start", "-p", "3100"],
    { cwd, env, stdio: "inherit" },
  );
  for (let i = 0; i < 100; i++) {
    try {
      const response = await fetch("http://127.0.0.1:3100");
      if (response.ok) break;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
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
  await page.route("**/_next/image?**", (route) =>
    route.fulfill({
      contentType: route.request().url().includes("logo")
        ? "image/webp"
        : "image/jpeg",
      body: route.request().url().includes("logo") ? logo : photo,
    }),
  );
  const paths = [
    "/",
    "/about",
    "/services",
    "/publications",
    "/events",
    "/news",
    "/contact",
    ...fixture.docs
      .filter((d) => d._type === "service")
      .map((d) => "/services/" + d.slug.current),
    ...fixture.docs
      .filter((d) => d._type === "event")
      .map((d) => "/events/" + d.slug.current),
    "/news/dr-tariq-jamil-iep-fellowship-2026",
  ];
  const widths = [280, 320, 375, 414, 600, 768, 1024, 1280, 1440, 1920, 2560];
  await mkdir(new URL("../test-results/", import.meta.url), {
    recursive: true,
  });
  const results = [];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
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
      results.push({ width, path, status: response.status(), overflow: false });
      if (
        (width === 375 || width === 1440) &&
        ["/services", "/about", "/news", "/publications", "/events"].includes(
          path,
        )
      )
        await page.screenshot({
          path: new URL(
            `../test-results/${path.slice(1)}-${width}.png`,
            import.meta.url,
          ).pathname,
          fullPage: true,
        });
    }
    console.log(`Verified ${paths.length} routes at ${width}px`);
  }
  await page.setViewportSize({ width: 375, height: 667 });
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
  await page.goto("http://127.0.0.1:3100/contact?service=lc3-technology");
  assert.equal(
    await page.getByLabel("Selected service", { exact: true }).inputValue(),
    "LC3 Technology",
  );
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
      "Thank you for your enquiry. Your message has been received by NC4SCM.",
      { exact: true },
    )
    .waitFor();
  assert.deepEqual(errors, []);
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
