import {createClient} from '@sanity/client';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {isDeepStrictEqual} from 'node:util';
import {buildEditorialPlan, fieldValue, hydrateMedia} from './editorial-plan.mjs';

const recipe = JSON.parse(await readFile(new URL('./editorial-update.json', import.meta.url), 'utf8'));
const token = process.env.SANITY_CONTENT_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;
const client = createClient({projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'dxinqb51', dataset: process.env.SANITY_STUDIO_DATASET || 'production', apiVersion: '2024-01-01', useCdn: false, perspective: 'raw', token, maxRetries: 0});
const documents = await client.fetch('*[_type in ["homePage", "aboutPage", "pageSettings", "siteSettings", "service", "news", "teamMember", "contentMigration"] && !(_id in path("versions.**"))]');
const plan = buildEditorialPlan(documents, recipe);
if (!plan) {
  console.log('News and team editorial update already published; subsequent Studio edits preserved.');
  process.exit(0);
}
console.log(`Prepared ${plan.updates.length} document updates and ${plan.creates.length} new records.`);
if (!process.argv.includes('--apply')) {
  console.log('Preview only. Pass --apply with an Editor token to upload media and publish.');
  process.exit(0);
}
if (!token) throw Error('An Editor token is required for publishing.');
await mkdir(new URL('./backups/', import.meta.url), {recursive: true});
await writeFile(new URL('./backups/editorial-before.json', import.meta.url), JSON.stringify({migrationId: recipe.migrationId, before: plan.updates.map(update => update.document), createdIds: plan.creates.map(document => document._id)}, null, 2));

const uploads = new Map();
const upload = file => {
  if (!uploads.has(file)) uploads.set(file, (async () => {
    const asset = await client.assets.upload('image', await readFile(new URL(file, import.meta.url)), {filename: file.split('/').at(-1)});
    return asset._id;
  })());
  return uploads.get(file);
};
// Bound uploads to one document at a time; asset IDs are content-addressed by Sanity.
const updates = [];
for (const update of plan.updates) updates.push({...update, set: await hydrateMedia(update.set, upload)});
const creates = [];
for (const document of plan.creates) creates.push(await hydrateMedia(document, upload));
let transaction = client.transaction();
for (const update of updates) transaction = transaction.patch(update.document._id, patch => patch.ifRevisionId(update.document._rev).set(update.set));
for (const document of creates) transaction = transaction.create(document);
transaction = transaction.create({_id: recipe.migrationId, _type: 'contentMigration', completedAt: new Date().toISOString(), source: 'Client instructions, supplied team biography and portrait, verified LinkedIn posts', documentIds: [...updates.map(update => update.document._id), ...creates.map(document => document._id)], assetCount: uploads.size});
await transaction.commit();
const saved = await client.getDocuments([...updates.map(update => update.document._id), ...creates.map(document => document._id)]);
for (const [index, update] of updates.entries()) {
  for (const [field, expected] of Object.entries(update.set)) {
    if (!isDeepStrictEqual(fieldValue(saved[index], field), expected)) throw Error(`Import verification failed: ${update.document._id}.${field}`);
  }
}
for (const [index, document] of creates.entries()) {
  for (const [field, expected] of Object.entries(document)) {
    if (!isDeepStrictEqual(saved[updates.length + index]?.[field], expected)) throw Error(`Import verification failed: ${document._id}.${field}`);
  }
}
console.log(`Verified ${updates.length} updated records, ${creates.length} created records and ${uploads.size} uploaded assets. All article text, photos and team profiles remain CMS-editable.`);
