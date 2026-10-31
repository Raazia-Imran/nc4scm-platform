const base = 'https://www.nc4scm.com';
export function pageMetadata(metadata) {
  const { title, description, alternates } = metadata;
  const image = { url: `${base}/media/opengraph-image.jpg`, alt: 'NC4SCM' };
  return {
    ...metadata,
    openGraph: { title, description, url: new URL(alternates?.canonical || '/', base).href, siteName: 'NC4SCM', type: 'website', images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  };
}
