import {createClient} from '@sanity/client';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {homeRefresh} from './home-refresh.mjs';
const client = createClient({projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'dxinqb51', dataset: process.env.SANITY_STUDIO_DATASET || 'production', apiVersion: '2024-01-01', useCdn: false, token: process.env.SANITY_CONTENT_WRITE_TOKEN, maxRetries: 0});
const marker = 'migration.home-approved-highlights-2026-10-11';
if (await client.getDocument(marker)) { console.log('Home refresh already applied; later CMS edits preserved.'); process.exit(0); }
if (!process.env.SANITY_CONTENT_WRITE_TOKEN) throw Error('SANITY_CONTENT_WRITE_TOKEN with Editor access is required.');
const homes = await client.fetch('*[_type == "homePage" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]');
if (homes.length !== 1) throw Error('Expected exactly one published Home Page.');
const home = homes[0];
if (await client.getDocument(`drafts.${home._id}`)) throw Error('Home Page has unpublished edits; publish or discard them first.');
const site = await client.fetch('*[_type == "siteSettings"][0]');
if (!site?.logo?.asset?._ref) throw Error('Existing NC4SCM logo is required.');
const logos = [{_key:'nc4scm',name:'NC4SCM',image:site.logo}];
for (const item of [{key:'ned',name:'NED University of Engineering & Technology',file:'ned.png'},{key:'hec',name:'Higher Education Commission',file:'hec.png'}]) {
 const asset = await client.assets.upload('image',await readFile(new URL(`./logos/${item.file}`,import.meta.url)),{filename:item.file});
 logos.push({_key:item.key,name:item.name,image:{_type:'image',alt:`${item.name} logo`,asset:{_type:'reference',_ref:asset._id},...(item.key==='ned'?{crop:{_type:'sanity.imageCrop',left:0,right:0.55,top:0,bottom:0}}:{})}});
}
const set = {...await homeRefresh(),institutionLogos:logos};
await mkdir(new URL('./backups/',import.meta.url),{recursive:true});
await writeFile(new URL('./backups/home-refresh-before.json',import.meta.url), JSON.stringify(home,null,2));
await client.transaction().patch(home._id,p=>p.ifRevisionId(home._rev).set(set).unset(['statistics','flagshipLabel','flagshipTitle','flagshipSummary','flagshipImage','flagshipLink'])).create({_id:marker,_type:'contentMigration',completedAt:new Date().toISOString(),source:'Client Word file and requested institution logos',fields:Object.keys(set)}).commit();
const saved = await client.getDocument(home._id);
if (saved.statistics || saved.flagshipTitle || saved.highlights?.length !== 4 || saved.institutionLogos?.length !== 3) throw Error('Home refresh verification failed.');
console.log('Home highlights, centre feature, and three CMS logo assets published.');
