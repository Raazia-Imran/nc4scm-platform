import {createClient} from '@sanity/client';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {isDeepStrictEqual} from 'node:util';
import {recipe as conferenceRecipe, planAdditions, hydrate} from './october-2026-plan.mjs';
const recipe = JSON.parse(await readFile(new URL('./azmat-profile.json', import.meta.url), 'utf8'));
const apply = process.argv.includes('--apply');
const token = process.env.SANITY_CONTENT_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;
const client = createClient({projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'dxinqb51', dataset: process.env.SANITY_STUDIO_DATASET || 'production', apiVersion: '2024-01-01', useCdn: false, perspective: 'raw', token, maxRetries: 0});
const existing = await client.fetch('*[_type in ["teamMember", "event", "news", "contentMigration"] && !(_id in path("versions.**"))]');
const plan = planAdditions(existing, recipe);
if (!plan.length) {
  console.log('Azmat profile already imported. Studio edits preserved.');
  process.exit(0);
}
console.log(`Ready to create ${plan.length} new CMS records: ${plan.map(d => d._id).join(', ')}`);
if (!apply) {
  console.log('Preview only. Pass --apply to publish.');
  process.exit(0);
}
if (!token) throw Error('A Sanity Editor token is required.');
await mkdir(new URL('./backups/', import.meta.url), {recursive: true});
await writeFile(new URL('./backups/azmat-before.json', import.meta.url), JSON.stringify({migrationId: recipe.migrationId, existing, createdIds: plan.map(d => d._id)}, null, 2));
const assets = new Map();
const upload = file => {
  if (!assets.has(file)) assets.set(file, (async () => {
    const asset = await client.assets.upload('image', await readFile(new URL(file, import.meta.url)), {filename: file.split('/').at(-1)});
    return asset._id;
  })());
  return assets.get(file);
};
const docs = [];
for (const doc of plan) {
  const hydrated = await hydrate(doc, upload);
  if (hydrated._type === 'news') hydrated.publishedAt = new Date().toISOString();
  docs.push(hydrated);
}
let tx = client.transaction();
for (const doc of docs) tx = tx.create(doc);
tx = tx.create({_id: recipe.migrationId, _type: 'contentMigration', completedAt: new Date().toISOString(), source: 'Client-supplied Azmat Chandio profile form and portrait, 25 October 2026', documentIds: docs.map(d => d._id)});
// A single atomic transaction prevents partial publication and duplicate reruns.
await tx.commit({visibility: 'sync'});
const saved = await client.getDocuments(docs.map(d => d._id));
for (const [index, doc] of docs.entries()) {
  for (const [field, value] of Object.entries(doc)) {
    if (!isDeepStrictEqual(saved[index]?.[field], value)) throw Error(`Verification failed: ${doc._id}.${field}`);
  }
}
console.log(`Verified ${docs.length} CMS records and ${assets.size} images. Future Studio edits will not be overwritten.`);
