import {createClient} from '@sanity/client';
import {mkdir,writeFile} from 'node:fs/promises';
const client=createClient({projectId:'dxinqb51',dataset:'production',apiVersion:'2024-01-01',useCdn:false,perspective:'raw',token:process.env.SANITY_CONTENT_WRITE_TOKEN||process.env.SANITY_AUTH_TOKEN});
const marker='migration.digital-platforms-card-2026-10-26';
if(await client.getDocument(marker)){console.log('Digital platforms card already published; later Studio edits preserved.');process.exit(0);}
const duplicates=await client.fetch('*[_type=="teamMember" && (_id=="team-razia" || slug.current=="razia" || lower(fullName) in ["razia","raazia imran","raazia imran reshamwala"])]');
if(duplicates.length)throw Error('Razia record already exists; review before adding another.');
const finance=await client.getDocument('team-salahuddin');
if(!finance||finance._rev!=='Cr6GuNdekma2M3LSKhY814'||await client.getDocument('drafts.team-salahuddin'))throw Error('Finance record changed or has draft edits; protected.');
const member={_id:'team-razia',_type:'teamMember',fullName:'Razia',slug:{_type:'slug',current:'razia'},position:'Website and CMS Developer',group:'digital-platforms',displayPriority:13,portraitPlaceholder:'female',cardSummary:'Razia develops and maintains NC4SCM’s main website, content management system and conference website.'};
await mkdir(new URL('./backups/',import.meta.url),{recursive:true});
await writeFile(new URL('./backups/digital-platforms-before.json',import.meta.url),JSON.stringify([finance],null,2));
if(!process.argv.includes('--apply')){console.log('Preview passed: basic Razia card before Finance; no unprovided contact details or qualifications.');process.exit(0);}
await client.transaction().patch(finance._id,p=>p.ifRevisionId(finance._rev).set({displayPriority:14})).create(member).create({_id:marker,_type:'contentMigration',completedAt:new Date().toISOString()}).commit({visibility:'sync'});
const docs=await client.getDocuments([member._id,finance._id]);
if(docs[0].fullName!=='Razia'||docs[0].group!=='digital-platforms'||docs[1].displayPriority!==14)throw Error('Saved card verification failed.');
console.log('Verified Razia digital platforms card and Finance last.');
