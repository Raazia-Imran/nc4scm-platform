import {createClient} from '@sanity/client';
import {mkdir,writeFile} from 'node:fs/promises';
import {isDeepStrictEqual} from 'node:util';

const client=createClient({projectId:'dxinqb51',dataset:'production',apiVersion:'2024-01-01',useCdn:false,perspective:'raw',token:process.env.SANITY_CONTENT_WRITE_TOKEN||process.env.SANITY_AUTH_TOKEN});
const migrationId='migration.azmat-hamza-profiles-2026-10-28';
const azmatId='team-azmat-chandio';
const hamzaId='team-muhammad-hamza';
const orcidUrl='https://orcid.org/0000-0002-3073-8087';
const googleScholarUrl='https://scholar.google.com/citations?user=aHeEbecAAAAJ&hl=en';
const researchGateUrl='https://www.researchgate.net/profile/Muhammad-Hamza-84?ev=hdr_xprf';

const previousSummary='Muhammad Hamza works as a Research Assistant at NC4SCM. His research interests include activating iron-rich kaolinite clay for LC³, cement and clay chemistry, and concrete technology.';
const cardSummary='Muhammad Hamza holds a B.E. in Civil Engineering from NED University of Engineering and Technology, Karachi. His work as a Research Assistant at NC4SCM focuses on cement and clay chemistry.';
const previousBioText="Muhammad Hamza's research interests include the activation of iron-rich kaolinite clay for LC³, cement and clay chemistry, and concrete technology.";
const bio=[
 {_type:'block',_key:'hamza-profile-1',style:'normal',markDefs:[],children:[{_type:'span',_key:'hamza-text-1',marks:[],text:'Muhammad Hamza holds a Bachelor of Engineering in Civil Engineering from NED University of Engineering and Technology, Karachi. He currently works as a Research Assistant at NC4SCM, focusing on cement and clay chemistry.'}]},
 {_type:'block',_key:'hamza-profile-2',style:'normal',markDefs:[],children:[{_type:'span',_key:'hamza-text-2',marks:[],text:'During his undergraduate studies, he was awarded a Mitacs Globalink Research Internship at Toronto Metropolitan University, Canada, where he investigated advanced cementitious materials, including ultra-high-performance concrete (UHPC), engineered cementitious composites (ECC), and geopolymer concrete (GPC).'}]},
 {_type:'block',_key:'hamza-profile-3',style:'normal',markDefs:[],children:[{_type:'span',_key:'hamza-text-3',marks:[],text:'His research interests include limestone calcined clay cement (LC³), calcined clay reactivity, and the development of low-carbon construction materials. His current work investigates the influence of clay mineralogy and iron content on cement hydration, rheological behaviour, and material performance, alongside evaluating the durability and corrosion resistance of cementitious systems.'}]}
];
const qualification='B.E. in Civil Engineering, NED University of Engineering and Technology, Karachi';
const researchInterests=['LC³ and calcined clay','Low-carbon construction materials','Cement durability and corrosion resistance'];
const desiredBiographyText=bio.map(block=>block.children.map(span=>span.text).join('')).join('\n\n');

if(await client.getDocument(migrationId)){console.log('Azmat and Hamza profile update already applied; later Studio edits preserved.');process.exit(0);}
const ids=[azmatId,hamzaId];
const [docs,drafts]=await Promise.all([client.getDocuments(ids),client.getDocuments(ids.map(id=>'drafts.'+id))]);
const [azmat,hamza]=docs;
if(!azmat||azmat._id!==azmatId||!hamza||hamza._id!==hamzaId)throw Error('Expected Azmat and Hamza records; protected.');
if(drafts.some(Boolean))throw Error('An unpublished draft exists; protected.');
if(azmat.fullName!=='Mr. Azmat Chandio'||hamza.fullName!=='Mr. Muhammad Hamza')throw Error('Member name changed since review; protected.');

for(const [field,value] of Object.entries({orcidUrl,googleScholarUrl}))
 if(azmat[field]!=null&&azmat[field]!==value)throw Error('Azmat academic profile changed; protected: '+field);
if(hamza.researchGateUrl!=null&&hamza.researchGateUrl!==researchGateUrl)throw Error('Hamza ResearchGate field changed; protected.');
if(hamza.cardSummary!=null&&hamza.cardSummary!==previousSummary&&hamza.cardSummary!==cardSummary)throw Error('Hamza summary changed since review; protected.');
if(hamza.qualification!=null&&hamza.qualification!==''&&hamza.qualification!==qualification)throw Error('Hamza qualification changed since review; protected.');
if(hamza.researchInterests!=null&&!isDeepStrictEqual(hamza.researchInterests,['LC³ clay activation','Cement and clay chemistry','Concrete technology'])&&!isDeepStrictEqual(hamza.researchInterests,researchInterests))throw Error('Hamza research interests changed since review; protected.');
const currentBioText=(hamza.bio||[]).map(block=>(block.children||[]).map(span=>span.text||'').join('')).join('\n\n');
if(hamza.bio!=null&&currentBioText!==previousBioText&&currentBioText!==desiredBiographyText)throw Error('Hamza biography changed since review; protected.');
if(cardSummary.length>400||/\b(I|my|me|we|our)\b/i.test(cardSummary))throw Error('Invalid third-person summary.');

if(!process.argv.includes('--apply')){console.log('Preview passed: add Azmat’s ORCID and Google Scholar; update Hamza’s ResearchGate, summary, qualification, interests and biography.');process.exit(0);}
await mkdir(new URL('./backups/',import.meta.url),{recursive:true});
await writeFile(new URL('./backups/azmat-hamza-profiles-before.json',import.meta.url),JSON.stringify(docs,null,2));
const azmatSet={orcidUrl,googleScholarUrl};
const hamzaSet={researchGateUrl,cardSummary,qualification,researchInterests,bio};
await client.transaction()
 .patch(azmatId,p=>p.ifRevisionId(azmat._rev).set(azmatSet))
 .patch(hamzaId,p=>p.ifRevisionId(hamza._rev).set(hamzaSet))
 .create({_id:migrationId,_type:'contentMigration',completedAt:new Date().toISOString(),source:'User-provided Azmat academic profiles and Muhammad Hamza profile details, 28 October 2026'})
 .commit({visibility:'sync'});
const saved=await client.getDocuments(ids);
for(const [i,fields] of [[0,azmatSet],[1,hamzaSet]]){
 for(const [field,value] of Object.entries(fields))if(!isDeepStrictEqual(saved[i][field],value))throw Error('Saved profile mismatch: '+saved[i]._id+'.'+field);
 if(saved[i].displayPriority!==docs[i].displayPriority||saved[i].fullName!==docs[i].fullName)throw Error('Existing name or directory order changed: '+saved[i]._id);
}
console.log('Verified Azmat ORCID and Google Scholar; Hamza ResearchGate, summary, qualification, interests and full biography; names and order preserved.');
