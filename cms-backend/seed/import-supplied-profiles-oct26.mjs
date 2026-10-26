import {createClient} from '@sanity/client';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {isDeepStrictEqual} from 'node:util';
const recipe=JSON.parse(await readFile(new URL('./supplied-profiles-oct26.json',import.meta.url),'utf8'));
const client=createClient({projectId:'dxinqb51',dataset:'production',apiVersion:'2024-01-01',useCdn:false,perspective:'raw',token:process.env.SANITY_CONTENT_WRITE_TOKEN||process.env.SANITY_AUTH_TOKEN});
if(await client.getDocument(recipe.migrationId)){console.log('Supplied portraits, profiles and ordering already published; later Studio edits preserved.');process.exit(0);}
const docs=await client.getDocuments(recipe.updates.map(x=>x.id));
const drafts=await client.getDocuments(recipe.updates.map(x=>'drafts.'+x.id));
for(const [i,x]of recipe.updates.entries())if(!docs[i]||docs[i]._rev!==x.expectedRevision||drafts[i])throw Error('Profile changed or has draft edits; protected: '+x.id);
const conflicts=await client.fetch('*[_type=="teamMember" && (_id==$id || _id==$draft || slug.current==$slug)]',{id:recipe.create._id,draft:'drafts.'+recipe.create._id,slug:recipe.create.slug.current});
if(conflicts.length)throw Error('Owais already exists; protected against duplicate import.');
for(const set of [...recipe.updates.map(x=>x.set),recipe.create])if(set.cardSummary&&(set.cardSummary.length>400||/\b(I|my|me|we|our)\b/i.test(set.cardSummary)))throw Error('Invalid short summary');
if(!process.argv.includes('--apply')){console.log('Preview passed: Ayesha and Dua text, three portraits, Nousheen completed, Owais added and thirteen visible members ordered.');process.exit(0);}
await mkdir(new URL('./backups/',import.meta.url),{recursive:true});
await writeFile(new URL('./backups/supplied-profiles-oct26-before.json',import.meta.url),JSON.stringify(docs,null,2));
async function hydrate(input,name){
 const {portraitFile,...set}=input;
 if(portraitFile){const asset=await client.assets.upload('image',await readFile(new URL(portraitFile,import.meta.url)),{filename:portraitFile.split('/').at(-1)});set.avatar={_type:'image',alt:'Portrait of '+name,asset:{_type:'reference',_ref:asset._id}};}
 return set;
}
const sets=[];for(const [i,x]of recipe.updates.entries())sets.push(await hydrate(x.set,x.set.fullName||docs[i].fullName));
const created=await hydrate(recipe.create,recipe.create.fullName);
let tx=client.transaction();
for(const [i,x]of recipe.updates.entries())tx=tx.patch(x.id,p=>p.ifRevisionId(docs[i]._rev).set(sets[i]));
await tx.create(created).create({_id:recipe.migrationId,_type:'contentMigration',completedAt:new Date().toISOString()}).commit({visibility:'sync'});
const saved=await client.getDocuments(recipe.updates.map(x=>x.id));
for(const [i,doc]of saved.entries())for(const [key,value]of Object.entries(sets[i]))if(!isDeepStrictEqual(doc[key],value))throw Error('Saved field mismatch: '+doc._id+'.'+key);
const newDoc=await client.getDocument(created._id);for(const [key,value]of Object.entries(created))if(!isDeepStrictEqual(newDoc[key],value))throw Error('New profile mismatch: '+key);
const ordered=await client.fetch('*[_type=="teamMember" && hideFromDirectory != true]|order(displayPriority asc)._id');
if(!isDeepStrictEqual(ordered,recipe.order))throw Error('Directory order mismatch: '+ordered.join(','));
console.log('Verified Ayesha full and short profile, Dua short profile, three portraits, Nousheen Iqbal, Engr. Muhammad Owais and final directory order; Salahuddin last.');
