import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/sanityClient";
import { photosFor } from "@/lib/archive-content";
import { getSiteContent } from "@/lib/content";
import { pageMetadata } from "@/lib/page-metadata";
import { safeHref } from "@/lib/safe-url.mjs";
import EventGallery from "@/app/components/EventGallery";
import RichTextRenderer from "@/app/components/RichTextRenderer";
export const revalidate = 60;
const query =
  '*[_type=="contributionProject"&&publicationApproved==true&&slug.current==$slug][0]{...,"supervisorProfiles":supervisors[]->{fullName}}';
export async function generateStaticParams() {
  return client.fetch(
    '*[_type=="contributionProject"&&publicationApproved==true&&defined(slug.current)]{"slug":slug.current}',
  );
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await client.fetch(query, { slug });
  if (!project) notFound();
  return pageMetadata({
    title: project?.title || "Project | NC4SCM",
    description: project?.summary,
    alternates: { canonical: `/legacy/projects/${slug}` },
  });
}
export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const [project, site] = await Promise.all([
    client.fetch(query, { slug }),
    getSiteContent(),
  ]);
  if (!project) notFound();
  const supervisors = [
    ...(project.supervisorProfiles || []).map((x) => x?.fullName),
    ...(project.supervisorNames || []),
  ].filter(Boolean);
  return (
    <>
      <section className="page-hero text-ivory">
        <div className="page-hero-inner">
          <Link className="eyebrow text-mint" href="/legacy#legacy-projects">
            Centre Archive / Projects ↗
          </Link>
          <h1 className="page-hero-title mt-5">{project.title}</h1>
          <p className="page-hero-intro">{project.summary}</p>
        </div>
      </section>
      <section className="section-shell archive-surface">
        <div className="legacy-project-detail">
          <aside>
            <p className="eyebrow text-clay">Project record</p>
            <dl>
              {[
                ["Year", project.year],
                ["Institution", project.institution],
                ["Project team", (project.participants || []).join(", ")],
                ["Supervision", supervisors.join(", ")],
              ].map(([label, value]) =>
                value ? (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ) : null,
              )}
            </dl>
          </aside>
          <article>
            <EventGallery
              images={photosFor(
                [
                  ...(project.coverImage ? [project.coverImage] : []),
                  ...(project.gallery || []),
                ],
                project.title,
              )}
              text={site.interfaceText}
            />
            <div className="mt-10">
              <RichTextRenderer value={project.body} />
            </div>
            {project.outcomes?.length > 0 && (
              <section className="project-outcomes">
                <h2>What the work contributed</h2>
                <ul>
                  {project.outcomes.map((outcome, i) => (
                    <li key={i}>{outcome}</li>
                  ))}
                </ul>
              </section>
            )}
            {safeHref(project.projectUrl) && (
              <a
                className="button button-dark mt-8"
                href={safeHref(project.projectUrl)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore the project ↗
              </a>
            )}
          </article>
        </div>
        <Link
          href="/legacy#legacy-projects"
          className="text-link inline-flex mt-12"
        >
          ← Back to the project collection
        </Link>
      </section>
    </>
  );
}
