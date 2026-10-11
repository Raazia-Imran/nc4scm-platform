import {readFile} from 'node:fs/promises';
// Extract complete approved sentences; publishing happens in a separate one-time CMS migration.
export async function homeStory() {
 const source=JSON.parse(await readFile(new URL('./approved-content.json',import.meta.url),'utf8'));
 const services=source.documents.filter(d=>d.type==='service').map(d=>d.set);
 const sentence=(title,index)=>{
  const body=services.find(s=>s.title===title).body.map(b=>b.children.map(c=>c.text||'').join('')).join(' ');
  return [...new Intl.Segmenter('en',{granularity:'sentence'}).segment(body)][index].segment.trim();
 };
 return {
  highlights:[
   {_key:'assessment',title:'Material assessment',description:sentence('Material Characterisation',2)},
   {_key:'testing',title:'Formulation and testing',description:sentence('New Material Development',2)},
   {_key:'validation',title:'Industrial validation',description:sentence('New Material Development',4)},
  ],
  experienceHeading:'Research and industry experience',
  experienceBody:sentence('LC3 Technology',2),
 };
}
