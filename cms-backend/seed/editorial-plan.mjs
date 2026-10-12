import {isDeepStrictEqual} from 'node:util';

export function fieldValue(document, path) {
  return path.split('.').reduce((value, key) => value?.[key], document);
}

export function appliedMarkerId(recipe, id) {
  return `${recipe.migrationId}.applied.${id}`;
}

export function buildEditorialPlan(documents, recipe) {
  if (documents.some(document => document._id === recipe.migrationId)) return null;
  const applied = id => documents.some(document => document._id === appliedMarkerId(recipe, id));
  const hasDraft = id => documents.some(document => document._id === `drafts.${id}`);
  const blocked = [];
  const updates = recipe.updates.flatMap(update => {
    if (applied(update.id)) return [];
    if (hasDraft(update.id)) {
      blocked.push(update.id);
      return [];
    }
    const document = documents.find(document => document._id === update.id);
    if (!document || document._type !== update.type) throw Error(`Missing or incorrect document: ${update.id}`);
    for (const [field, expected] of Object.entries(update.expected)) {
      if (!isDeepStrictEqual(fieldValue(document, field) ?? null, expected))
        throw Error(`Content changed since review: ${update.id}.${field}. Review the Studio edit before importing.`);
    }
    return [{document, set: update.set}];
  });
  const creates = recipe.creates.filter(create => {
    if (applied(create._id)) return false;
    if (hasDraft(create._id)) {
      blocked.push(create._id);
      return false;
    }
    if (documents.some(document => document._id === create._id ||
      (document._type === create._type && document.slug?.current === create.slug?.current)))
      throw Error(`Existing record or duplicate slug: ${create._id}`);
    return true;
  });
  return {updates, creates, blocked};
}

export async function hydrateMedia(value, upload) {
  if (Array.isArray(value)) return Promise.all(value.map(item => hydrateMedia(item, upload)));
  if (!value || typeof value !== 'object') return value;
  if (value._localImage) {
    const {_localImage, ...fields} = value;
    if (!/^(news|team)-media\/[a-z0-9-]+\.(jpg|png)$/.test(_localImage)) throw Error('Invalid local asset path');
    return {...fields, _type: 'image', asset: {_type: 'reference', _ref: await upload(_localImage)}};
  }
  return Object.fromEntries(await Promise.all(Object.entries(value).map(async ([key, item]) => [key, await hydrateMedia(item, upload)])));
}
