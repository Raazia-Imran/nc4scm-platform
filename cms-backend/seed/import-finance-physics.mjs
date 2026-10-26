import {createClient} from '@sanity/client';
import {mkdir,writeFile} from 'node:fs/promises';
const client=createClient({projectId:'dxinqb51',dataset:'production',apiVersion:'2024-01-01',useCdn:false,perspective:'raw',token:process.env.SANITY_CONTENT_WRITE_TOKEN||process.env.SANITY_AUTH_TOKEN});
const marker='migration.finance-and-physics-profiles-2026-10-26';
if(await client.getDocument(marker)){console.log('Finance and Physics profile update already applied; subsequent Studio edits preserved.');process.exit(0);}
const updates=[
{id:'team-ayesha-bint-e-arif',revision:'Aen22h1ZYKhFm15GDVF48q',name:'Ms. Ayesha Bint e Arif',summary:'Ayesha Bint e Arif is a Physics graduate pursuing an MS in Physics at NED University. Her research focuses on computational materials modelling of irradiated systems containing minerals using MD simulations.'},
{id:'team-dua-arif',revision:'Aen22h1ZYKhFm15GDVF48q',name:'Ms. Dua Arif',summary:'Dua Arif is a Physics graduate pursuing an MS in Physics at NED. Her research uses computational simulations to investigate ion adsorption and radiation-induced effects in minerals.'}
];
const docs=await client.getDocuments(updates.map(x=>x.id));
const drafts=await client.getDocuments(updates.map(x=>'drafts.'+x.id));
for(const [i,x] of updates.entries())if(!docs[i]||docs[i]._rev!==x.revision||drafts[i])throw Error('Profile changed or has draft edits; protected: '+x.id);
const duplicates=await client.fetch('*[_type=="teamMember" && (lower(fullName) match "*salahuddin*" || slug.current=="salahuddin")]');
if(duplicates.length)throw Error('Salahuddin record already exists; review rather than duplicate.');
const member={_id:'team-salahuddin',_type:'teamMember',fullName:'Mr. Salahuddin',slug:{_type:'slug',current:'salahuddin'},position:'Finance',group:'finance',displayPriority:5,portraitPlaceholder:'neutral'};
await mkdir(new URL('./backups/',import.meta.url),{recursive:true});
await writeFile(new URL('./backups/finance-physics-before.json',import.meta.url),JSON.stringify(docs,null,2));
const sets=docs.map((doc,i)=>({fullName:updates[i].name,cardSummary:updates[i].summary,qualification:doc.qualification?.replace(/Medical Physics/g,'Physics')||'',bio:(doc.bio||[]).map(block=>({...block,children:(block.children||[]).map(span=>({...span,...(typeof span.text==='string'?{text:span.text.replace(/Medical Physics/g,'Physics')}:{})}))}))}));
if(!process.argv.includes('--apply')){console.log('Preview passed: two profile corrections and one Finance member.');process.exit(0);}
let tx=client.transaction();
for(const [i,x]of updates.entries())tx=tx.patch(x.id,p=>p.ifRevisionId(docs[i]._rev).set(sets[i]));
await tx.create(member).create({_id:marker,_type:'contentMigration',completedAt:new Date().toISOString()}).commit({visibility:'sync'});
const saved=await client.getDocuments([...updates.map(x=>x.id),member._id]);
for(const [i,x]of updates.entries()){
 const doc=saved[i];if(doc.fullName!==x.name||doc.cardSummary!==x.summary||JSON.stringify(doc).includes('Medical Physics'))throw Error('Profile verification failed: '+x.id);
}
if(saved[2].position!=='Finance'||saved[2].fullName!==member.fullName)throw Error('Finance member verification failed');
console.log('Verified Ms. Ayesha and Ms. Dua Physics profiles and Mr. Salahuddin, Finance. No unprovided contact details or portrait added.');
