import {createClient} from '@sanity/client';
import {mkdir,writeFile} from 'node:fs/promises';
const client=createClient({projectId:'dxinqb51',dataset:'production',apiVersion:'2024-01-01',useCdn:false,perspective:'raw',token:process.env.SANITY_CONTENT_WRITE_TOKEN||process.env.SANITY_AUTH_TOKEN});
const marker='migration.nausheen-directory-2026-10-26';
if(await client.getDocument(marker)){console.log('Directory replacement already applied; later edits preserved.');process.exit(0);}
const old=await client.getDocument('team-mah-e-rukh-mustafa');
if(!old||old._rev!=='Aen22h1ZYKhFm15GDVF48q'||await client.getDocument('drafts.'+old._id))throw Error('Former member changed or has draft edits; protected.');
const duplicates=await client.fetch('*[_type=="teamMember" && (lower(fullName) match "*nausheen*" || slug.current=="nausheen")]');
if(duplicates.length)throw Error('Nausheen record already exists; review rather than duplicate.');
const physics=await client.getDocuments(['team-ayesha-bint-e-arif','team-dua-arif']);
for(const doc of physics){if(!doc||/medical/i.test(JSON.stringify({bio:doc.bio,cardSummary:doc.cardSummary,qualification:doc.qualification})))throw Error('Physics profiles require review: '+doc?._id);}
await mkdir(new URL('./backups/',import.meta.url),{recursive:true});
await writeFile(new URL('./backups/nausheen-directory-before.json',import.meta.url),JSON.stringify([old,...physics],null,2));
const member={_id:'team-nausheen',_type:'teamMember',fullName:'Ms. Nausheen',slug:{_type:'slug',current:'nausheen'},position:'Research Assistant',group:'research-staff',displayPriority:old.displayPriority,portraitPlaceholder:'female'};
if(!process.argv.includes('--apply')){console.log('Preview passed: preserve and hide Mah-E-Rukh, add Nausheen with pending details; both Physics profiles contain no Medical.');process.exit(0);}
await client.transaction().patch(old._id,p=>p.ifRevisionId(old._rev).set({hideFromDirectory:true})).create(member).create({_id:marker,_type:'contentMigration',completedAt:new Date().toISOString()}).commit({visibility:'sync'});
const saved=await client.getDocuments([old._id,member._id]);
if(saved[0].hideFromDirectory!==true||saved[1]?.fullName!==member.fullName)throw Error('Saved directory replacement mismatch');
console.log('Verified former profile hidden and Nausheen added; both detailed Physics profiles contain no Medical.');
