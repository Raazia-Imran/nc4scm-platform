import { readFile } from 'node:fs/promises';
export async function homeRefresh() {
  const source = JSON.parse(await readFile(new URL('./approved-content.json', import.meta.url), 'utf8'));
  const site = source.documents.find(d => d.type === 'siteSettings').set;
  return {
    highlights: source.documents.filter(d => d.type === 'service').map((d, i) => ({_key: `highlight-${i}`, title: d.set.title, description: d.set.summary})),
    featureLabel: 'NC4SCM',
    featureTitle: site.organizationName,
    featureSummary: site.missionLine,
  };
}
