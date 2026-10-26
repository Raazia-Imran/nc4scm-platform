import {createClient} from '@sanity/client';
import {mkdir,writeFile} from 'node:fs/promises';
import {isDeepStrictEqual} from 'node:util';
const updates=[
 {id:'team-rumaisa-ali',before:'Rumaisa Ali',after:'Ms. Rumaisa Ali'},
 {id:'team-azmat-chandio',before:'Azmat Chandio',after:'Mr. Azmat Chandio'},
 {id:'team-muhammad-hamza',before:'Muhammad Hamza',after:'Mr. Muhammad Hamza'},
 {id:'team-muhammad-umer',before:'Muhammad Umer',after:'Mr. Muhammad Umer'},
 {id:'team-razia',before:'Raazia Imran Reshamwala',after:'Ms. Raazia Imran Reshamwala'}
];
const migrationId='migration.team-honorifics-2026-10-26';
const client=createClient({projectId:'dxinqb51',dataset:'production',apiVersion:'2024-01-01',useCdn:false,perspective:'raw',token:process.env.SANITY_CONTENT_WRITE_TOKEN||process.env.SANITY_AUTH_TOKEN});
if(await client.getDocument(migrationId)){console.log('Missing team honorifics already published; later Studio edits preserved.');process.exit(0);}
const ids=updates.map(x=>x.id);
const [docs,drafts]=await Promise.all([client.getDocuments(ids),client.getDocuments(ids.map(id=>'drafts.'+id))]);
for(const [i,x]of updates.entries())if(!docs[i]||docs[i]._id!==x.id||docs[i].fullName!==x.before||drafts[i])throw Error('Profile changed or has draft edits; protected: '+x.id);
if(!process.argv.includes('--apply')){console.log('Preview passed: five missing Ms./Mr. honorifics; all other names and team order remain untouched.');process.exit(0);}
await mkdir(new URL('./backups/',import.meta.url),{recursive:true});
await writeFile(new URL('./backups/team-honorifics-before.json',import.meta.url),JSON.stringify(docs,null,2));
let tx=client.transaction();
for(const [i,x]of updates.entries())tx=tx.patch(x.id,p=>p.ifRevisionId(docs[i]._rev).set({fullName:x.after}));
tx=tx.create({_id:migrationId,_type:'contentMigration',completedAt:new Date().toISOString()});
await tx.commit({visibility:'sync'});
const saved=await client.getDocuments(ids);
for(const [i,x]of updates.entries())if(saved[i].fullName!==x.after||saved[i].displayPriority!==docs[i].displayPriority)throw Error('Saved name mismatch or team order changed: '+x.id);
console.log('Verified Ms./Mr. prefixes for Rumaisa, Azmat, Hamza, Umer and Raazia. Existing bios, links, portraits and order preserved.');
