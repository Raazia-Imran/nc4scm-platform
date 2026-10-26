import {createClient} from '@sanity/client';
import {mkdir,writeFile} from 'node:fs/promises';
const id='team-rumaisa-ali';
const orcid='https://orcid.org/0009-0008-7675-5174';
const migrationId='migration.rumaisa-orcid-2026-10-26';
const client=createClient({projectId:'dxinqb51',dataset:'production',apiVersion:'2024-01-01',useCdn:false,perspective:'raw',token:process.env.SANITY_CONTENT_WRITE_TOKEN||process.env.SANITY_AUTH_TOKEN});
if(!/^https:\/\/orcid\.org\/\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(orcid))throw Error('Invalid ORCID URL');
if(await client.getDocument(migrationId)){console.log('Rumaisa ORCID already published; later Studio edits preserved.');process.exit(0);}
const doc=await client.getDocument(id);
const draft=await client.getDocument('drafts.'+id);
if(!doc||draft||doc.fullName!=='Rumaisa Ali'||doc.slug?.current!=='rumaisa-ali')throw Error('Rumaisa profile changed or has draft edits; protected.');
if(doc.profileUrl&&doc.profileUrl!==orcid)throw Error('An academic profile link is already set; protected.');
if(!process.argv.includes('--apply')){console.log('Preview passed: set the existing academic profile link to Rumaisa’s ORCID.');process.exit(0);}
await mkdir(new URL('./backups/',import.meta.url),{recursive:true});
await writeFile(new URL('./backups/rumaisa-orcid-before.json',import.meta.url),JSON.stringify(doc,null,2));
await client.transaction().patch(id,p=>p.ifRevisionId(doc._rev).set({profileUrl:orcid})).create({_id:migrationId,_type:'contentMigration',completedAt:new Date().toISOString()}).commit({visibility:'sync'});
const saved=await client.getDocument(id);
if(saved.profileUrl!==orcid||saved.displayPriority!==doc.displayPriority)throw Error('ORCID verification failed or team order changed.');
console.log('Verified Rumaisa’s ORCID academic profile link; existing profile details and order preserved.');
