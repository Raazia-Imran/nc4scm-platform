import { createClient } from "@sanity/client";
import { mkdir, writeFile } from "node:fs/promises";
import { prepareContent } from "./prepare-approved-content.mjs";

// No frontend imports this file. After migration, Content Lake is the only
// source read by the website; later Studio edits are never overwritten on build.
const apply = process.argv.includes("--apply");
const payload = await prepareContent();
const token = process.env.SANITY_AUTH_TOKEN;
if (!token && apply)
  throw new Error(
    "SANITY_AUTH_TOKEN must be configured securely to apply CMS changes.",
  );
const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "dxinqb51",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  timeout: 15000,
  maxRetries: 0,
  token,
  perspective: "raw",
  ...(process.env.SANITY_API_HOST
    ? { apiHost: process.env.SANITY_API_HOST, useProjectHostname: false }
    : {}),
});
const migrationId = `migration.${payload.version}`;
const previous = await client.getDocument(migrationId);
if (previous) {
  if (previous.contentHash !== payload.hash)
    throw new Error(
      "Migration already ran with different content. Create a new version instead of overwriting client edits.",
    );
  console.log("Approved content was already imported. Studio edits preserved.");
  process.exit(0);
}
let transaction = client.transaction();
const backup = [];
const targets = [];
for (const entry of payload.documents) {
  const candidates = await client.fetch(
    '*[_type == $type && !(_id in path("drafts.**")) && !(_id in path("versions.**")) && ($slug == "" || slug.current == $slug)]',
    { type: entry.type, slug: entry.slug || "" },
  );
  if (candidates.length > 1)
    throw new Error(
      `Ambiguous ${entry.type} ${entry.slug || "singleton"}; resolve duplicates before importing.`,
    );
  const existing = candidates[0];
  const id = existing?._id || entry.id;
  const draft = await client.getDocument(`drafts.${id}`);
  if (draft)
    throw new Error(
      `Unpublished edits exist for ${id}. Publish or discard that draft in Studio before importing.`,
    );
  if (existing) backup.push(existing);
  const create = { _id: id, _type: entry.type };
  const set = { ...entry.set };
  if (set.contactPeople && existing?.contactPeople) {
    set.contactPeople = set.contactPeople.map((person) => {
      const old = existing.contactPeople.find(
        (item) => item.email === person.email,
      );
      return { ...old, ...person, _key: old?._key || person._key };
    });
    set.contactPeople.push(
      ...existing.contactPeople.filter(
        (person) =>
          !set.contactPeople.some((item) => item.email === person.email),
      ),
    );
  }
  if (!existing) transaction = transaction.create(create);
  transaction = transaction.patch(id, (patch) => {
    let next = patch.set(set);
    if (existing) next = next.ifRevisionId(existing._rev);
    if (entry.defaults) {
      const defaults = { ...entry.defaults };
      if (existing?.interfaceText && defaults.interfaceText) {
        for (const [key, value] of Object.entries(defaults.interfaceText))
          defaults[`interfaceText.${key}`] = value;
        delete defaults.interfaceText;
      }
      next = next.setIfMissing(defaults);
    }
    return next;
  });
  targets.push({ id, entry, set });
}
// The form explicitly says to hide incomplete testimonials. Never invent a
// quotation, and leave complete existing quotations untouched.
const incomplete = await client.fetch(
  '*[_type == "testimonial" && !(_id in path("drafts.**")) && !(_id in path("versions.**")) && (!defined(quote) || quote == "" || !defined(personName) || personName == "")]',
);
for (const doc of incomplete) {
  backup.push(doc);
  transaction = transaction.patch(doc._id, (p) =>
    p.ifRevisionId(doc._rev).set({ published: false }),
  );
}
const config = client.config();
console.log(
  `${apply ? "Applying" : "Previewing"} ${targets.length} content updates and ${incomplete.length} incomplete testimonial visibility updates in ${config.projectId}/${config.dataset}.`,
);
console.log(
  targets
    .map(({ id, entry }) => `${id}: ${Object.keys(entry.set).join(", ")}`)
    .join("\n"),
);
if (!apply) {
  console.log("Dry run only. Use --apply after reviewing this plan.");
  process.exit(0);
}
await mkdir("seed/backups", { recursive: true });
await writeFile(
  `seed/backups/${payload.version}-${Date.now()}.json`,
  JSON.stringify(
    {
      projectId: config.projectId,
      dataset: config.dataset,
      documents: backup,
      newIds: targets
        .filter(({ id }) => !backup.some((d) => d._id === id))
        .map(({ id }) => id),
    },
    null,
    2,
  ),
);
transaction = transaction.create({
  _id: migrationId,
  _type: "contentMigration",
  contentHash: payload.hash,
  source: payload.source.file,
  sourceHash: payload.source.sha256,
  importedAt: new Date().toISOString(),
});
await transaction.commit({ visibility: "sync" });
for (const { id, set } of targets) {
  const updated = await client.getDocument(id);
  for (const [key, value] of Object.entries(set)) {
    if (JSON.stringify(updated[key]) !== JSON.stringify(value))
      throw new Error(
        `Verification failed for ${id}.${key}. Check backup before retrying.`,
      );
  }
}
console.log(
  "Verified every approved field against the import source. Images and unrelated content preserved.",
);
