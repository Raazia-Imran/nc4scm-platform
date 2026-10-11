import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {homeRefresh} from '../seed/home-refresh.mjs';
test('homepage replacement contains approved service summaries and centre mission without numeric claims', async () => {
 const source=JSON.parse(await readFile(new URL('../seed/approved-content.json',import.meta.url),'utf8'));
 const result=await homeRefresh();
 assert.deepEqual(result.highlights.map(h=>[h.title,h.description]),source.documents.filter(d=>d.type==='service').map(d=>[d.set.title,d.set.summary]));
 const site=source.documents.find(d=>d.type==='siteSettings').set;
 assert.equal(result.featureTitle,site.organizationName);
 assert.equal(result.featureSummary,site.missionLine);
 assert.ok(!JSON.stringify(result).includes('NRPU'));
 assert.ok(!('statistics' in result));
});
