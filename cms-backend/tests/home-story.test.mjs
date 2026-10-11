import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {homeStory} from '../seed/home-story.mjs';
test('Homepage excerpts retain complete approved client sentences, without repeating service summaries',async()=>{
 const source=JSON.parse(await readFile(new URL('../seed/approved-content.json',import.meta.url),'utf8'));
 const services=source.documents.filter(d=>d.type==='service').map(d=>d.set);
 const bodies=services.map(s=>s.body.map(b=>b.children.map(c=>c.text||'').join('')).join(' '));
 const story=await homeStory();
 assert.equal(story.highlights.length,3);
 for(const excerpt of [...story.highlights.map(h=>h.description),story.experienceBody]){
  assert.ok(bodies.some(b=>b.includes(excerpt)),excerpt);
  assert.ok(!services.some(s=>s.summary===excerpt));
 }
 assert.ok(story.experienceBody.includes('NED UET'));
});
