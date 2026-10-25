import {readFile} from 'node:fs/promises';
export const recipe = JSON.parse(await readFile(new URL('./october-2026-additions.json', import.meta.url), 'utf8'));
const normalize = value => (value || '').trim().toLowerCase();
export function planAdditions(existing, input = recipe) {
  if (existing.some(d => d._id === input.migrationId)) return [];
  const ids = new Set();
  for (const doc of input.documents) {
    if (ids.has(doc._id)) throw Error(`Repeated import ID: ${doc._id}`);
    ids.add(doc._id);
    const collision = existing.find(d => d._id === doc._id || d._id === `drafts.${doc._id}` ||
      (d._type === doc._type && (d.slug?.current === doc.slug.current ||
        (doc._type === 'teamMember' && normalize(d.fullName) === normalize(doc.fullName)))));
    if (collision) throw Error(`Existing record or draft protected: ${collision._id}. Review it before importing ${doc._id}.`);
  }
  return input.documents;
}
export async function hydrate(value, upload) {
  if (Array.isArray(value)) return Promise.all(value.map(item => hydrate(item, upload)));
  if (!value || typeof value !== 'object') return value;
  const {_upload, ...rest} = value;
  const result = Object.fromEntries(await Promise.all(Object.entries(rest).map(async ([key, item]) => [key, await hydrate(item, upload)])));
  if (_upload) result.asset = {_type: 'reference', _ref: await upload(_upload)};
  return result;
}
