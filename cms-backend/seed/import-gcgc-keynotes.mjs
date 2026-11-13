import {createClient} from '@sanity/client';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {isDeepStrictEqual} from 'node:util';
const recipe=JSON.parse(await readFile(new URL('./gcgc-2027-keynotes.json',import.meta.url),'utf8'));
const client=createClient({projectId:'dxinqb51',dataset:'production',apiVersion:'2024-01-01',useCdn:false,perspective:'raw',token:process.env.SANITY_CONTENT_WRITE_TOKEN||process.env.SANITY_AUTH_TOKEN,maxRetries:0});
const migrationId='migration.gcgc-dates-keynotes-2026-11-13';
if(await client.getDocument(migrationId)){console.log('GCGC dates and keynotes already published; subsequent Studio edits preserved.');process.exit(0);}
const ids=['event-gcgc-2027','news-gcgc-2027-announcement'];
const [docs,drafts]=await Promise.all([client.getDocuments(ids),client.getDocuments(ids.map(id=>'drafts.'+id))]);
if(drafts.some(Boolean))throw Error('Unpublished conference edits exist; refusing to overwrite.');
const [event,news]=docs;
if(!event||event._type!=='event'||event.slug?.current!=='gcgc-2027'||!news||news._type!=='news')throw Error('Expected conference records are missing.');
if(event.eventDateTime!=='2027-04-10T00:00:00+05:00'||event.endDateTime!=='2027-04-11T23:59:59+05:00'||event.keynoteProfiles?.length||event.speakers?.length)throw Error('Conference dates or speakers changed since review.');
const replaceDate=value=>typeof value==='string'?value.replaceAll('10–11 April','16–17 April'):value;
const eventSet={eventDateTime:'2027-04-16T00:00:00+05:00',endDateTime:'2027-04-17T23:59:59+05:00',dateOnly:true,description:replaceDate(event.description),speakers:recipe.keynoteProfiles.map(p=>p.name),keynoteProfiles:recipe.keynoteProfiles};
const newsSet={headline:replaceDate(news.headline),excerpt:replaceDate(news.excerpt),body:news.body.map(block=>({...block,...(block.children?{children:block.children.map(span=>({...span,text:replaceDate(span.text)}))}:{})}))};
console.log('Reviewed update: 16–17 April 2027, two sourced keynote profiles, matching conference announcement.');
if(!process.argv.includes('--apply')){console.log('Preview only.');process.exit(0);}
await mkdir(new URL('./backups/',import.meta.url),{recursive:true});
await writeFile(new URL('./backups/gcgc-keynotes-before.json',import.meta.url),JSON.stringify(docs,null,2));
// Replace the obsolete dated poster with the corrected conference banner.
const asset=await client.assets.upload('image',await readFile(new URL('./gcgc-2027-banner.png',import.meta.url)),{filename:'gcgc-2027-16-17-april.png'});
const coverImage={_type:'image',asset:{_type:'reference',_ref:asset._id},alt:'GCGC 2027, 16–17 April 2027, Karachi, Pakistan'};
eventSet.coverImage=coverImage;newsSet.coverImage=coverImage;
await client.transaction()
 .patch(event._id,p=>p.ifRevisionId(event._rev).set(eventSet))
 .patch(news._id,p=>p.ifRevisionId(news._rev).set(newsSet))
 .create({_id:migrationId,_type:'contentMigration',completedAt:new Date().toISOString(),source:'Organizer-approved conference dates and keynote invitations, 13 November 2026; biographies verified against LC3, LCCA and ETH Zurich',documentIds:ids})
 .commit({visibility:'sync'});
const saved=await client.getDocuments(ids);
for(const [index,fields] of [[0,eventSet],[1,newsSet]])for(const [key,value] of Object.entries(fields))if(!isDeepStrictEqual(saved[index][key],value))throw Error('Published content mismatch: '+ids[index]+'.'+key);
console.log('Verified published conference dates, keynote profiles, announcement and corrected banner.');
