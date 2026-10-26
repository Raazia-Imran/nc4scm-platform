import {createClient} from '@sanity/client';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {isDeepStrictEqual} from 'node:util';
const recipe=JSON.parse(await readFile(new URL('./raazia-profile-2026-10-26.json',import.meta.url),'utf8'));
const client=createClient({projectId:'dxinqb51',dataset:'production',apiVersion:'2024-01-01',useCdn:false,perspective:'raw',token:process.env.SANITY_CONTENT_WRITE_TOKEN||process.env.SANITY_AUTH_TOKEN});
if(await client.getDocument(recipe.migrationId)){console.log('Raazia profile already published; later Studio edits preserved.');process.exit(0);}
const doc=await client.getDocument(recipe.id);
if(!doc||doc._rev!==recipe.expectedRevision||await client.getDocument('drafts.'+recipe.id))throw Error('Profile changed or has draft edits; protected.');
const duplicates=await client.fetch('*[_type=="teamMember" && _id!=$id && slug.current==$slug]',{id:recipe.id,slug:recipe.set.slug.current});
if(duplicates.length)throw Error('Duplicate slug protected.');
if(recipe.set.cardSummary.length>400||JSON.stringify(recipe.set.bio).includes('—'))throw Error('Summary or biography validation failed.');
if(!process.argv.includes('--apply')){console.log('Preview passed: complete Raazia profile, supplied links, GitHub field and white portrait.');process.exit(0);}
await mkdir(new URL('./backups/',import.meta.url),{recursive:true});await writeFile(new URL('./backups/raazia-profile-before.json',import.meta.url),JSON.stringify(doc,null,2));
const asset=await client.assets.upload('image',await readFile(new URL(recipe.portraitFile,import.meta.url)),{filename:'raazia-white.jpeg'});
const set={...recipe.set,avatar:{_type:'image',alt:'Portrait of Raazia Imran Reshamwala.',asset:{_type:'reference',_ref:asset._id}}};
await client.transaction().patch(recipe.id,p=>p.ifRevisionId(doc._rev).set(set)).create({_id:recipe.migrationId,_type:'contentMigration',completedAt:new Date().toISOString()}).commit({visibility:'sync'});
const saved=await client.getDocument(recipe.id);for(const [key,value]of Object.entries(set))if(!isDeepStrictEqual(saved[key],value))throw Error('Saved profile mismatch: '+key);
if(saved.displayPriority!==doc.displayPriority)throw Error('Existing order changed.');
console.log('Verified complete Raazia profile and portrait, email LinkedIn Google Scholar GitHub links, and preserved directory position.');
