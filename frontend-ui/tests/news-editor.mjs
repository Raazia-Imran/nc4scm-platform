import assert from 'node:assert/strict';

// Model an editor publishing a new slug after the site has already been built.
export async function verifyNewsEditor(page, fixture, baseUrl) {
  const existing = fixture.docs.find(document => document._type === 'news');
  const slug = `cms-editor-after-build-${Date.now()}`;
  const image = {...existing.coverImage,_key:'inline-photo',caption:'Editor supplied inline photo caption'};
  fixture.docs.push({
    _id:slug,_type:'news',headline:'CMS article published after build',
    slug:{_type:'slug',current:slug},category:'update',
    excerpt:'A short preview, with the full body available on the article page.',
    publishedAt:'2026-10-12T08:00:00Z',
    body:[{_type:'block',_key:'copy',style:'normal',markDefs:[],children:[{_type:'span',_key:'text',marks:[],text:'The complete CMS article body remains visible without clipping or preview ellipses.'}]},image,{...image,_key:'second-photo',caption:'Second editor supplied photo caption'}],
  });
  const response=await page.goto(baseUrl+'/news/'+slug,{waitUntil:'networkidle'});
  assert.equal(response.status(),200);
  assert.ok(await page.getByText('The complete CMS article body remains visible without clipping or preview ellipses.',{exact:true}).isVisible());
  assert.equal(await page.locator('article figure').count(),2);
  assert.ok(await page.getByText('Editor supplied inline photo caption',{exact:true}).isVisible());
  assert.ok(await page.getByText('Second editor supplied photo caption',{exact:true}).isVisible());
  console.log('Verified a newly published CMS slug and two inline photographs with captions after build.');
}
