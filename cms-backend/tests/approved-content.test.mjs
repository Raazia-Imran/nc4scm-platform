import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { prepareContent } from "../seed/prepare-approved-content.mjs";
import { createFixture } from "./sanity-fixture.mjs";
const execute = promisify(execFile);
const source = JSON.parse(
  await readFile(
    new URL("../seed/approved-content.source.json", import.meta.url),
    "utf8",
  ),
);
const payload = await prepareContent();

test("all four services preserve every approved sentence and bullet", () => {
  for (let i = 2; i <= 5; i++) {
    const rows = Object.fromEntries(
      source.tables[i].map((row) => [row.field, row.approved.trim()]),
    );
    const service = payload.documents[i].set;
    assert.equal(service.title, rows["Portfolio Name"]);
    assert.equal(service.summary, rows["Short Summary"]);
    assert.equal(service.body[0].children[0].text, rows["Full Description"]);
    assert.equal(service.slug.current, rows.Slug.replace("Keep As Is — ", ""));
    const bullets = (value) =>
      value
        .split("\n")
        .map((x) => x.replace(/^•\s*/, "").trim())
        .filter((x) => x && x !== ".");
    assert.deepEqual(service.methods, bullets(rows["Methods & Capabilities"]));
    assert.deepEqual(
      service.deliverables,
      bullets(rows["Typical Deliverables"]),
    );
    assert.ok(service.summary.length <= 120);
    assert.ok(service.methods.length >= 7);
    assert.ok(service.deliverables.length >= 5);
  }
});
test("all five headings and introductions match the Word form", () => {
  const page = payload.documents[1].set;
  for (const [i, prefix] of [
    "services",
    "research",
    "events",
    "news",
    "contact",
  ].entries()) {
    const [heading, intro] = source.tables[1][i].approved
      .trim()
      .split("\nIntroduction: ");
    assert.equal(page[prefix + "Headline"], heading.replace("Heading: ", ""));
    assert.equal(page[prefix + "Introduction"], intro);
  }
  assert.equal(page.contactSuccessMessage, source.tables[1][5].approved);
});
test("missing assets and placeholders are never published by the migration", () => {
  for (const doc of payload.documents)
    assert.ok(
      !doc.set.image && !doc.set.logo && !doc.set.portrait && !doc.set.quote,
    );
  assert.ok(!JSON.stringify(payload).includes("I do not have"));
  assert.equal(payload.documents.length, 7);
});
test("import patches actual slug IDs, preserves assets and unrelated fields, and reruns preserve Studio edits", async () => {
  const initial = payload.documents.map((entry, index) => ({
    _id: entry.slug ? "existing-" + index : entry.id,
    _type: entry.type,
    ...(entry.slug ? { slug: { current: entry.slug } } : {}),
    _rev: "fixture-revision-1",
    image: { asset: { _ref: "image-abc-800x600-jpg" } },
    custom: "preserve",
    ...(entry.type === "siteSettings"
      ? {
          interfaceText: { explore: "Client-edited Explore" },
          navigation: [{ label: "Approved existing nav", href: "/about" }],
        }
      : {}),
  }));
  const fixture = await createFixture(initial);
  try {
    const env = {
      ...process.env,
      SANITY_API_HOST: fixture.host,
      SANITY_AUTH_TOKEN: "local-test-only",
      SANITY_STUDIO_PROJECT_ID: "dxinqb51",
      SANITY_STUDIO_DATASET: "production",
    };
    const cwd = new URL("../", import.meta.url);
    await execute(process.execPath, ["seed/import-approved-content.mjs"], {
      cwd,
      env,
    });
    assert.ok(!fixture.docs.some((d) => d._type === "contentMigration"));
    await execute(
      process.execPath,
      ["seed/import-approved-content.mjs", "--apply"],
      { cwd, env },
    );
    const service = fixture.docs.find((d) => d._id === "existing-2");
    assert.equal(service.title, "LC3 Technology");
    assert.equal(service.custom, "preserve");
    assert.equal(service.image.asset._ref, "image-abc-800x600-jpg");
    const site = fixture.docs.find((d) => d._type === "siteSettings");
    assert.equal(site.interfaceText.explore, "Client-edited Explore");
    assert.equal(site.interfaceText.methods, "Methods & capabilities");
    service.summary = "Later Studio edit";
    const rerun = await execute(
      process.execPath,
      ["seed/import-approved-content.mjs", "--apply"],
      { cwd, env },
    );
    assert.match(rerun.stdout, /already imported/);
    assert.equal(service.summary, "Later Studio edit");
  } finally {
    await fixture.close();
  }
});
test("duplicate slugs and existing drafts stop the entire migration before writes", async () => {
  for (const situation of ["duplicate", "draft"]) {
    const docs = [
      {
        _id: "a",
        _type: "service",
        slug: { current: "lc3-technology" },
        _rev: "fixture-revision-1",
      },
    ];
    docs.push(
      situation === "draft"
        ? { ...docs[0], _id: "drafts.a" }
        : { ...docs[0], _id: "b" },
    );
    const fixture = await createFixture(docs);
    try {
      await assert.rejects(
        execute(
          process.execPath,
          ["seed/import-approved-content.mjs", "--apply"],
          {
            cwd: new URL("../", import.meta.url),
            env: {
              ...process.env,
              SANITY_API_HOST: fixture.host,
              SANITY_AUTH_TOKEN: "local-test-only",
            },
          },
        ),
        situation === "draft" ? /Unpublished edits/ : /Ambiguous/,
      );
      assert.ok(!fixture.docs.some((d) => d._type === "siteSettings"));
    } finally {
      await fixture.close();
    }
  }
});
