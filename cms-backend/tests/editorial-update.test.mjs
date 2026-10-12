import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';
import {appliedMarkerId, buildEditorialPlan, hydrateMedia} from '../seed/editorial-plan.mjs';
const recipe = JSON.parse(await readFile(new URL('../seed/editorial-update.json', import.meta.url), 'utf8'));
function baseline() {
  return recipe.updates.map(update => {
    const doc = {_id: update.id, _type: update.type, _rev: 'reviewed'};
    for (const [path, value] of Object.entries(update.expected)) {
      const parts = path.split('.');
      let parent = doc;
      for (const key of parts.slice(0,-1)) parent = parent[key] ||= {};
      parent[parts.at(-1)] = structuredClone(value);
    }
    return doc;
  });
}
test('one-time plan adds two unique articles and two Co-PIs without changing publication citations', () => {
  const docs = [...baseline(), {_id:'publication-keep',_type:'publication',title:'Existing paper'}];
  const plan = buildEditorialPlan(docs, recipe);
  assert.equal(plan.creates.filter(doc => doc._type === 'news').length, 2);
  assert.equal(plan.creates.filter(doc => doc.group === 'co-principal-investigator').length, 2);
  assert.ok(plan.updates.every(update => update.document._type !== 'publication'));
  assert.equal(docs.at(-1).title, 'Existing paper');
  assert.equal(buildEditorialPlan([...docs,{_id:recipe.migrationId}], recipe), null);
});
test('an unpublished draft is preserved while unrelated updates can be imported once', () => {
  const protectedId = 'news-gcgc-structural-demonstration-2025';
  const first = buildEditorialPlan([...baseline(),{_id:`drafts.${protectedId}`}],recipe);
  assert.deepEqual(first.blocked,[protectedId]);
  assert.equal(first.updates.length,recipe.updates.length-1);
  assert.equal(first.creates.length,recipe.creates.length);
  const markers = [...first.updates.map(item=>item.document._id),...first.creates.map(item=>item._id)]
    .map(id=>({_id:appliedMarkerId(recipe,id),_type:'contentMigration'}));
  const retry = buildEditorialPlan([...baseline(),...markers,{_id:`drafts.${protectedId}`}],recipe);
  assert.deepEqual(retry.blocked,[protectedId]);
  assert.equal(retry.updates.length,0);
  assert.equal(retry.creates.length,0);
  const ready = buildEditorialPlan([...baseline(),...markers],recipe);
  assert.deepEqual(ready.updates.map(item=>item.document._id),[protectedId]);
  assert.equal(ready.creates.length,0);
});
test('changed fields and duplicate new slugs still stop the import', () => {
  const changed = baseline();changed[0].servicesIntro = 'Client edited introduction';
  assert.throws(() => buildEditorialPlan(changed,recipe), /Content changed since review/);
  const duplicate = {_id:'different-id',_type:'news',slug:recipe.creates.find(doc=>doc._type==='news').slug};
  assert.throws(() => buildEditorialPlan([...baseline(),duplicate],recipe), /duplicate slug/);
});
test('all nine articles have complete body text and all 52 sourced photos are included', async () => {
  const news = [...recipe.updates.filter(update => update.type==='news').map(update=>update.set),...recipe.creates.filter(doc=>doc._type==='news')];
  assert.equal(news.length,9);
  assert.equal(news.reduce((count,doc)=>count+1+doc.gallery.length,0),52);
  const files = [];
  const resolved = await hydrateMedia(news,async file => {
    await stat(new URL('../seed/'+file,import.meta.url));files.push(file);return 'image-fixture-800x600-jpg';
  });
  assert.equal(new Set(files).size,52);
  for (const doc of resolved) {
    assert.ok(doc.body.length>=2);
    assert.ok(doc.coverImage.asset._ref);
    assert.ok(doc.gallery.every(image=>image.alt && image.asset._ref));
    assert.ok(!JSON.stringify(doc).includes('_localImage'));
  }
  await assert.rejects(()=>hydrateMedia({_localImage:'../secret.txt'},()=>{}),/Invalid local asset/);
});
test('institutional copy removes first-person narration and preserves the requested team order', () => {
  assert.doesNotMatch(JSON.stringify(recipe.updates.map(update=>update.set)), /\b(we|our|us|you|your)\b/i);
  const home = recipe.updates.find(update=>update.type==='homePage').set;
  assert.ok(!('institutionLogos' in home));
  assert.ok(!('highlights' in home));
  const team = recipe.creates.filter(doc=>doc._type==='teamMember').sort((a,b)=>a.displayPriority-b.displayPriority);
  assert.deepEqual(team.map(doc=>doc.displayPriority),[2,3]);
  assert.equal(team[0].avatar,undefined);
  assert.ok(team[1].avatar._localImage);
  assert.equal(recipe.updates.find(update=>update.id==='team-muhammad-danyal-sheikh').set.displayPriority,4);
});
