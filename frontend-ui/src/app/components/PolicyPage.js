import Link from 'next/link';
import { getSiteContent } from '@/lib/content';
export default async function PolicyPage({ title, introduction, sections }) {
  const site = await getSiteContent();
  return <>
    <section className="page-hero text-ivory"><div className="page-hero-inner"><p className="eyebrow text-mint">NC4SCM</p><h1 className="page-hero-title mt-6">{title}</h1><p className="page-hero-intro">{introduction}</p></div></section>
    <article className="section-shell marble-surface"><div className="mx-auto max-w-3xl space-y-8">
      <p className="text-sm">Last updated: 31 October 2026</p>
      {sections.map(({ heading, body }) => <section key={heading}><h2 className="text-2xl font-semibold text-forest">{heading}</h2><p className="mt-3 whitespace-pre-line leading-8">{body}</p></section>)}
      <section><h2 className="text-2xl font-semibold text-forest">Contact</h2><p className="mt-3 leading-8">For questions about this notice or information you have shared, <Link href="/contact" className="underline">contact NC4SCM</Link>{site.email && <> at <a className="underline" href={`mailto:${site.email}`}>{site.email}</a></>}.</p></section>
      <nav aria-label="Website notices" className="flex flex-wrap gap-6"><Link className="text-link" href="/privacy">Privacy</Link><Link className="text-link" href="/cookies">Cookies and external services</Link><Link className="text-link" href="/terms">Terms of use</Link></nav>
    </div></article>
  </>;
}
