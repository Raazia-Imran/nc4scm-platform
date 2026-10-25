import test from 'node:test';
import assert from 'node:assert/strict';
import {access, readFile} from 'node:fs/promises';
import {recipe, planAdditions, hydrate} from '../seed/october-2026-plan.mjs';
test('poster produces an event and announcement with honest dates and existing media', async () => {
  const docs = planAdditions([]);
  assert.equal(docs.length, 2);
  const event = docs.find(d => d._type === 'event');
  assert.equal(event.dateOnly, true);
  assert.equal(new Date(event.eventDateTime).toISOString(), '2027-04-09T19:00:00.000Z');
  assert.equal(new Date(event.endDateTime).toISOString(), '2027-04-11T18:59:59.000Z');
  assert.match(event.description, /Proposed important dates/);
  assert.equal(event.speakers.length, 0);
  assert.equal(docs.find(d => d._type === 'news').category, 'announcement');
  await hydrate(docs, async file => { await access(new URL('../seed/' + file, import.meta.url)); return 'image-test'; });
});
test('completed migration preserves later CMS edits', () => {
  assert.deepEqual(planAdditions([{_id: recipe.migrationId}, {...recipe.documents[0], title: 'Changed in Studio'}]), []);
});
test('existing IDs, matching names and unpublished slugs cannot be overwritten', () => {
  const doc = recipe.documents[0];
  for (const collision of [{_id:doc._id}, {_id:'drafts.'+doc._id}, {_id:'drafts.other',_type:doc._type,slug:doc.slug}])
    assert.throws(() => planAdditions([collision]), /protected/);
});
test('asset placeholders become editable Sanity image references', async () => {
  const result = await hydrate({coverImage:{_type:'image',alt:'Poster',_upload:'poster.jpg'}}, async file => {
    assert.equal(file, 'poster.jpg'); return 'image-abc-100x200-jpg';
  });
  assert.deepEqual(result,{coverImage:{_type:'image',alt:'Poster',asset:{_type:'reference',_ref:'image-abc-100x200-jpg'}}});
});

test('RA import retains six unique profiles, four identified portraits and supplied contacts', async () => {
  const input = JSON.parse(await readFile(new URL('../seed/research-assistants-2026-10-25.json', import.meta.url), 'utf8'));
  const docs = planAdditions([], input);
  assert.equal(docs.length, 6);
  assert.equal(docs.filter(d => d.fullName === 'Muhammad Umer').length, 1);
  assert.equal(docs.filter(d => d.avatar).length, 4);
  assert.ok(docs.every(d => d.group === 'research-staff' && d.bio.length && d.email && d.linkedinUrl));
  assert.deepEqual(docs.map(d => d.displayPriority), [100,101,102,103,104,105]);
  assert.equal(docs.find(d => d.fullName === 'Dua Arif').secondaryEmail, 'Arif.pg4500067@cloud.neduet.edu.pk');
  assert.ok(docs.find(d => d.fullName === 'Muhammad Hamza').bio[0].children[0].text.includes('Fe-rich kaolinite'));
  await hydrate(docs, async file => {await access(new URL('../seed/' + file, import.meta.url)); return 'image-test';});
  assert.deepEqual(planAdditions([{_id:input.migrationId}], input), []);
  const person = docs[0];
  assert.throws(() => planAdditions([{_id:'other',_type:'teamMember',fullName:person.fullName.toUpperCase()}], input), /protected/);
});
