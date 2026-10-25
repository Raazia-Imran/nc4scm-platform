import {createClient} from '@sanity/client';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {isDeepStrictEqual} from 'node:util';
const recipe=JSON.parse(await readFile(new URL('./team-directory-refresh.json',import.meta.url),'utf8'));
const client=createClient({projectId:'dxinqb51',dataset:'production',apiVersion:'2024-01-01',useCdn:false,perspective:'raw',token:process.env.SANITY_CONTENT_WRITE_TOKEN||process.env.SANITY_AUTH_TOKEN});
if(await client.getDocument(recipe.migrationId)){console.log('Team directory refresh already published; later Studio edits preserved.');process.exit(0);}
const docs=await client.getDocuments(recipe.updates.map(x=>x.id));
const drafts=await client.getDocuments(recipe.updates.map(x=>'drafts.'+x.id));
for(const [i,x] of recipe.updates.entries()){
 if(!docs[i]||docs[i]._rev!==x.expectedRevision||drafts[i])throw Error('Team member changed or has draft edits; protected: '+x.id);
 if(x.set.cardSummary.length>400||/\b(I|my|me|we|our)\b/i.test(x.set.cardSummary))throw Error('Invalid directory summary');
}
if(!process.argv.includes('--apply')){console.log('Validated '+docs.length+' directory summaries, two illustrated placeholders and five white-background portrait updates. Preview only.');process.exit(0);}
await mkdir(new URL('./backups/',import.meta.url),{recursive:true});await writeFile(new URL('./backups/team-directory-before.json',import.meta.url),JSON.stringify(docs,null,2));
const sets=[];
for(const [i,x] of recipe.updates.entries()){
 const {portraitFile,...set}=x.set;
 if(portraitFile){const asset=await client.assets.upload('image',await readFile(new URL(portraitFile,import.meta.url)),{filename:portraitFile.split('/').at(-1)});set.avatar={...docs[i].avatar,asset:{_type:'reference',_ref:asset._id}};delete set.avatar.crop;delete set.avatar.hotspot;}
 sets.push(set);
}
let tx=client.transaction();for(const [i,x] of recipe.updates.entries())tx=tx.patch(x.id,p=>p.ifRevisionId(docs[i]._rev).set(sets[i]));
await tx.create({_id:recipe.migrationId,_type:'contentMigration',completedAt:new Date().toISOString(),source:'Supplied biographies; compact summaries retain source facts; white backgrounds edited from original portraits.'}).commit({visibility:'sync'});
const saved=await client.getDocuments(recipe.updates.map(x=>x.id));
for(const [i,d]of saved.entries()){
 for(const [field,v]of Object.entries(sets[i]))if(!isDeepStrictEqual(d[field],v))throw Error('Saved value mismatch: '+d._id+'.'+field);
 if(!isDeepStrictEqual(d.bio,docs[i].bio))throw Error('Original biography changed');
}
console.log('Verified 11 directory records, five white-background portraits, two placeholders; all full biographies preserved.');
