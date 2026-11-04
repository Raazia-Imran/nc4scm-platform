import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanityClient";
import { urlFor } from "@/lib/image-url";
import { getSiteContent } from "@/lib/content";
import { pageMetadata } from "@/lib/page-metadata";
import { photosFor } from "@/lib/archive-content";
import TeamDirectory from "@/app/components/TeamDirectory";
import EventGallery from "@/app/components/EventGallery";
import RichTextRenderer from "@/app/components/RichTextRenderer";
export const revalidate = 60;
export const metadata = pageMetadata({
  title: "Centre Archive | NC4SCM",
  description:
    "The people, student and research projects, and practical contributions that continue to shape NC4SCM.",
  alternates: { canonical: "/legacy" },
});
export default async function LegacyPage() {
  const [data, site] = await Promise.all([
    client.fetch(
      `{"page":*[_type=="legacyPage"][0],"aboutImage":*[_type=="aboutPage"][0].heroImage,"members":*[_type=="teamMember"&&hideFromDirectory!=true]|order(displayPriority asc){...},"projects":*[_type=="contributionProject"&&publicationApproved==true]|order(displayOrder asc,year desc){...},"practice":*[_type=="practicalContributor"&&publicationApproved==true]|order(displayOrder asc){...,"projects":relatedProjects[]->{title,slug,publicationApproved}[publicationApproved==true]}}`,
    ),
    getSiteContent(),
  ]);
  const page = data.page || {},
    projects = data.projects || [],
    practice = data.practice || [];
  const hero = page.heroImage || data.aboutImage;
  const heroSrc = urlFor(hero)
    ?.ignoreImageParams()
    .width(1400)
    .fit("max")
    .auto("format")
    .url();
  return (
    <>
      <section className="legacy-hero">
        <div className="legacy-hero-inner">
          <div className="legacy-hero-copy">
            <p className="eyebrow text-mint">
              {page.eyebrow || "The NC4SCM Centre Archive"}
            </p>
            <h1>
              {page.headline || (
                <>
                  Centre
                  <br />
                  <em>Archive.</em>
                </>
              )}
            </h1>
            <p>
              {page.introduction ||
                "A centre is shaped by more than the present. Meet the people, explore the projects and recognise the practical contributions that remain part of our story."}
            </p>
            <a href="#legacy-people" className="legacy-explore">
              Explore the archive <span aria-hidden="true">↓</span>
            </a>
          </div>
          <figure className="legacy-hero-image">
            {heroSrc ? (
              <Image
                src={heroSrc}
                alt={hero.alt || "NC4SCM research and collaboration"}
                fill
                priority
                sizes="(max-width:900px) 100vw, 45vw"
                className="object-cover"
              />
            ) : (
              <div className="legacy-hero-monogram" aria-hidden="true">
                NC
                <br />
                4SCM
              </div>
            )}
            <figcaption>
              <span>People. Knowledge. Practice.</span>
              <span aria-hidden="true">↗</span>
            </figcaption>
          </figure>
        </div>
      </section>
      <nav className="legacy-index section-shell" aria-label="Centre Archive sections">
        {[
          ["01", "People", "The people who shaped the centre", "people"],
          ["02", "Projects", "Ideas developed into lasting work", "projects"],
          ["03", "Practice", "The hands behind the progress", "practice"],
        ].map(([n, title, copy, id]) => (
          <a key={id} href={`#legacy-${id}`}>
            <span>{n}</span>
            <div>
              <strong>{title}</strong>
              <small>{copy}</small>
            </div>
            <span aria-hidden="true">↘</span>
          </a>
        ))}
      </nav>
      <section id="legacy-people" className="section-shell legacy-people">
        <div className="legacy-section-heading">
          <p className="eyebrow text-clay">01 / People</p>
          <h2>
            {page.peopleHeading || (
              <>
                Once part of the team.
                <br />
                <em>Always part of the story.</em>
              </>
            )}
          </h2>
          <p>
            {page.peopleIntroduction ||
              "Recognising former colleagues and the expertise, care and ideas they contributed to the centre."}
          </p>
        </div>
        <TeamDirectory
          members={data.members || []}
          text={site.interfaceText || {}}
          scope="past"
          now={Date.now()}
        />
        <Link className="text-link inline-flex mt-8" href="/about#people">
          Meet the current team ↗
        </Link>
      </section>
      <section id="legacy-projects" className="section-shell legacy-projects">
        <div className="legacy-section-heading">
          <p className="eyebrow text-clay">02 / Projects</p>
          <h2>
            {page.projectsHeading || (
              <>
                Ideas that became
                <br />
                <em>something lasting.</em>
              </>
            )}
          </h2>
          <p>
            {page.projectsIntroduction ||
              "Student projects, research and collaborations, with the people and outcomes behind each one."}
          </p>
        </div>
        <div className="legacy-project-grid">
          {projects.length ? (
            projects.map((project, index) => {
              const src = urlFor(project.coverImage)
                ?.ignoreImageParams()
                .width(1100)
                .fit("max")
                .auto("format")
                .url();
              return project.slug?.current ? (
                <Link
                  className="legacy-project-card"
                  key={project._id}
                  href={`/legacy/projects/${project.slug.current}`}
                >
                  <div className="legacy-project-image">
                    {src ? (
                      <Image
                        src={src}
                        alt={project.coverImage.alt || project.title}
                        fill
                        sizes="(max-width:767px) 90vw, 45vw"
                        className="object-cover"
                      />
                    ) : (
                      <span
                        className="legacy-project-placeholder"
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    )}
                    <span className="legacy-project-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </div>
                  <div className="legacy-project-meta">
                    <span>
                      {project.projectType === "student"
                        ? "Student / FYDP"
                        : project.projectType === "industry"
                          ? "Industry collaboration"
                          : "Research project"}
                    </span>
                    <span>{project.year}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                </Link>
              ) : null;
            })
          ) : (
            <div className="archive-empty">
              <span className="archive-empty-mark" aria-hidden="true">
                02
              </span>
              <h3>A place for lasting ideas.</h3>
              <p>
                Approved student projects, research outcomes and collaborations
                will be collected here as their stories are published.
              </p>
            </div>
          )}
        </div>
      </section>
      <section id="legacy-practice" className="section-shell legacy-practice">
        <div className="legacy-section-heading">
          <p className="eyebrow text-mint">03 / Craft & practice</p>
          <h2>
            {page.practiceHeading || (
              <>
                Progress has
                <br />
                <em>many hands.</em>
              </>
            )}
          </h2>
          <p>
            {page.practiceIntroduction ||
              "Acknowledging the technicians, craftspeople, workers and practical teams whose skill helps turn research into real work."}
          </p>
        </div>
        {practice.length ? (
          <div className="practice-grid">
            {practice.map((person) => {
              const src = urlFor(person.portrait)
                ?.ignoreImageParams()
                .width(700)
                .fit("max")
                .auto("format")
                .url();
              return (
                <article className="practice-card" key={person._id}>
                  {src && (
                    <div className="practice-image">
                      <Image
                        src={src}
                        alt={person.portrait.alt || person.fullName}
                        fill
                        sizes="(max-width:767px) 90vw, 35vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="practice-card-copy">
                    <p className="eyebrow">{person.role}</p>
                    <h3>{person.fullName}</h3>
                    {person.period && (
                      <p className="practice-period">{person.period}</p>
                    )}
                    <p>{person.contribution}</p>
                    {person.skills?.length > 0 && (
                      <ul className="practice-skills">
                        {person.skills.map((skill) => (
                          <li key={skill}>{skill}</li>
                        ))}
                      </ul>
                    )}
                    {(person.story?.length > 0 ||
                      person.gallery?.length > 0) && (
                      <details className="practice-story">
                        <summary>
                          Read the contribution{" "}
                          <span aria-hidden="true">↗</span>
                        </summary>
                        <RichTextRenderer value={person.story} />
                        <EventGallery
                          images={photosFor(person.gallery, person.fullName)}
                          text={site.interfaceText}
                        />
                      </details>
                    )}
                    {person.projects?.map(
                      (project) =>
                        project?.slug?.current && (
                          <Link
                            className="text-link"
                            key={project.slug.current}
                            href={`/legacy/projects/${project.slug.current}`}
                          >
                            {project.title} ↗
                          </Link>
                        ),
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="practice-empty">
            <span aria-hidden="true">↗</span>
            <h3>Every contribution deserves recognition.</h3>
            <p>
              Approved profiles and work photographs will appear here as the
              centre documents these contributions.
            </p>
          </div>
        )}
      </section>
      <section className="legacy-closing section-shell">
        <p className="eyebrow text-clay">An ongoing story</p>
        <h2>
          The next chapter
          <br />
          is <em>being made.</em>
        </h2>
        <Link className="button button-dark" href="/events/timeline">
          Explore the journey in pictures ↗
        </Link>
      </section>
    </>
  );
}
