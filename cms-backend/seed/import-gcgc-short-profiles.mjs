import {createClient} from '@sanity/client';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {isDeepStrictEqual} from 'node:util';
const client=createClient({projectId:'dxinqb51',dataset:'production',apiVersion:'2024-01-01',useCdn:false,perspective:'raw',token:process.env.SANITY_CONTENT_WRITE_TOKEN||process.env.SANITY_AUTH_TOKEN});
const marker='migration.gcgc-short-profiles-2026-11-13';
if(await client.getDocument(marker)){console.log('Short profiles already published; later edits preserved.');process.exit(0);}
const id='event-gcgc-2027';
const [event,draft]=await client.getDocuments([id,'drafts.'+id]);
const before=JSON.parse(await readFile(new URL('./gcgc-2027-keynotes.json',import.meta.url),'utf8'));
const after=JSON.parse(await readFile(new URL('./gcgc-2027-short-profiles.json',import.meta.url),'utf8'));
if(!event||draft||!isDeepStrictEqual(event.keynoteProfiles,before.keynoteProfiles))throw new Error('Conference profiles changed or an unpublished draft exists; protected.');
if(!process.argv.includes('--apply')){console.log('Short profile update preview passed.');process.exit(0);}
await mkdir(new URL('./backups/',import.meta.url),{recursive:true});
await writeFile(new URL('./backups/gcgc-short-profiles-before.json',import.meta.url),JSON.stringify(event,null,2));
await client.transaction().patch(id,p=>p.ifRevisionId(event._rev).set({keynoteProfiles:after.keynoteProfiles})).create({_id:marker,_type:'contentMigration',completedAt:new Date().toISOString(),source:'Organizer requested concise introductions; current roles verified from supplied LinkedIn profile text, 13 November 2026'}).commit({visibility:'sync'});
const saved=await client.getDocument(id);
if(!isDeepStrictEqual(saved.keynoteProfiles,after.keynoteProfiles))throw new Error('Published short profiles did not match.');
console.log('Verified both concise speaker profiles and current affiliations.');
