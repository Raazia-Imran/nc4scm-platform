import {createClient} from '@sanity/client';
import {mkdir,writeFile} from 'node:fs/promises';
const client=createClient({projectId:'dxinqb51',dataset:'production',apiVersion:'2024-01-01',useCdn:false,perspective:'raw',token:process.env.SANITY_CONTENT_WRITE_TOKEN||process.env.SANITY_AUTH_TOKEN});
const marker='migration.third-person-team-profiles-2026-10-25';
if(await client.getDocument(marker)){console.log('Profile editorial update already applied; subsequent edits preserved.');process.exit(0);}
const updates=[
['team-mah-e-rukh-mustafa','I hold a Master of Engineering',"Mah-E-Rukh Mustafa holds a Master of Engineering in Materials Engineering from Huazhong University of Science and Technology (HUST), China. Her research within the GetInnovative4Impact project at NC4SCM focuses on high-entropy alloys and metal additive manufacturing, with an emphasis on the relationships between processing, microstructure and material properties. Her broader research interests include sheet metal forming, failure analysis and advanced materials characterization, with the goal of contributing to high-performance materials for advanced engineering applications."],
['team-rumaisa-ali','I graduated with a B.E.',"Rumaisa Ali holds a B.E. in Civil Engineering from NED University of Engineering and Technology and is currently pursuing a master's degree in Structural Earthquake Engineering at NED. Her research interests include sustainable construction materials, recycled aggregate concrete and performance-based seismic design. At NC4SCM, she is working on a review article examining the combined mechanical and durability performance of LC³ and recycled aggregate. Her thesis contributes to research on sustainable materials in earthquake-resistant construction."],
['team-muhammad-hamza','Fe-rich kaolinite clay activation',"Muhammad Hamza's research interests include the activation of iron-rich kaolinite clay for LC³, cement and clay chemistry, and concrete technology."]
];
const docs=await client.getDocuments(updates.map(x=>x[0]));
const sites=await client.fetch('*[_type=="siteSettings" && !(_id in path("drafts.**"))]');
if(sites.length!==1)throw Error('Expected one published site settings record');
const site=sites[0];
for(const doc of [...docs,site])if(!doc||await client.getDocument('drafts.'+doc._id))throw Error('Missing document or unpublished edits; protected.');
for(const [i,entry] of updates.entries())if(!docs[i].bio?.[0]?.children?.[0]?.text?.startsWith(entry[1]))throw Error('Biography changed since review; protected.');
await mkdir(new URL('./backups/',import.meta.url),{recursive:true});await writeFile(new URL('./backups/third-person-profiles-before.json',import.meta.url),JSON.stringify([...docs,site],null,2));
let tx=client.transaction();
for(const [i,[id,,text]] of updates.entries())tx=tx.patch(id,p=>p.ifRevisionId(docs[i]._rev).set({bio:[{_type:'block',_key:'profile',style:'normal',markDefs:[],children:[{_type:'span',_key:'text',marks:[],text}]}]}));
tx=tx.patch(site._id,p=>p.ifRevisionId(site._rev).setIfMissing({interfaceText:{}}).set({'interfaceText.biography':'Profile'}));
await tx.create({_id:marker,_type:'contentMigration',completedAt:new Date().toISOString()}).commit({visibility:'sync'});
const saved=await client.getDocuments(updates.map(x=>x[0]));for(const [i,x] of saved.entries())if(x.bio[0].children[0].text!==updates[i][2])throw Error('Saved biography mismatch');
console.log('Verified three third-person profiles and Profile control label.');
