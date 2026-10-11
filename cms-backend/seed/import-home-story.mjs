import {createClient} from '@sanity/client';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {homeStory} from './home-story.mjs';
const client=createClient({projectId:process.env.SANITY_STUDIO_PROJECT_ID||'dxinqb51',dataset:process.env.SANITY_STUDIO_DATASET||'production',apiVersion:'2024-01-01',useCdn:false,token:process.env.SANITY_CONTENT_WRITE_TOKEN,maxRetries:0});
const marker='migration.home-client-story-2026-10-11';
if(await client.getDocument(marker)){console.log('Homepage story already published; subsequent CMS edits preserved.');process.exit(0);}
if(!process.env.SANITY_CONTENT_WRITE_TOKEN)throw Error('SANITY_CONTENT_WRITE_TOKEN with Editor access is required.');
const homes=await client.fetch('*[_type=="homePage" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]');
if(homes.length!==1)throw Error('Expected exactly one published Home Page.');
const home=homes[0];
if(await client.getDocument(`drafts.${home._id}`))throw Error('Home Page has unpublished edits; publish or discard them first.');
const logos=[...(home.institutionLogos||[])];
for(const item of [{key:'ned',name:'NED University of Engineering & Technology',file:'client-ned.jpg'},{key:'hec',name:'Higher Education Commission',file:'client-hec.png'}]){
 const asset=await client.assets.upload('image',await readFile(new URL(`./logos/${item.file}`,import.meta.url)),{filename:item.file});
 const index=logos.findIndex(l=>l._key===item.key);
 const logo={...(index>=0?logos[index]:{}),_key:item.key,name:item.name,image:{_type:'image',alt:`${item.name} logo`,asset:{_type:'reference',_ref:asset._id}}};
 if(index>=0)logos[index]=logo;else logos.push(logo);
}
const set={...await homeStory(),institutionLogos:logos};
await mkdir(new URL('./backups/',import.meta.url),{recursive:true});
await writeFile(new URL('./backups/home-story-before.json',import.meta.url),JSON.stringify(home,null,2));
await client.transaction().patch(home._id,p=>p.ifRevisionId(home._rev).set(set)).create({_id:marker,_type:'contentMigration',completedAt:new Date().toISOString(),source:'Client Word approved service descriptions; supplied NED and HEC logo files',fields:Object.keys(set)}).commit();
const saved=await client.getDocument(home._id);
if(saved.highlights?.length!==3 || saved.experienceBody!==set.experienceBody)throw Error('Homepage story verification failed.');
console.log('Approved homepage excerpts and client-supplied institution logos published to CMS.');
