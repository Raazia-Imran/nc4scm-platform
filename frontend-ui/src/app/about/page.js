// src/app/about/page.js
// -----------------------------------------------------------------------------
// The About Hub. Three pieces of content are fetched in parallel:
//   1. Team members (sorted by displayPriority — an editor-controlled field,
//      not just publish order, so leadership can be pinned to the top).
//   2. Institutional partners (for the logo grid).
// The center overview copy is static prose since no CMS field was requested
// for it; if it needs to become editable later, add a "siteSettings"
// singleton document type in Sanity and fetch it the same way.
// -----------------------------------------------------------------------------
import Image from 'next/image'
import Link from 'next/link'
import {client, urlFor} from '@/sanityClient'

const TEAM_QUERY = `*[_type == "teamMember"] | order(displayPriority asc){
  _id, fullName, slug, position, avatar
}`

const PARTNERS_QUERY = `*[_type == "partner"] | order(organizationName asc){
  _id, organizationName, logo, targetUrl
}`

export const metadata = {
  title: 'About — NC4SCM',
}

export default async function AboutPage() {
  const [team, partners] = await Promise.all([
    client.fetch(TEAM_QUERY),
    client.fetch(PARTNERS_QUERY),
  ])

  return (
    <>
      {/* ------------------------------------------------------------------
          CENTER OVERVIEW — split layout: heading on the left, prose on
          the right, on a two-column grid that collapses on mobile.
      ------------------------------------------------------------------ */}
      <section className="mx-auto max-w-content px-6 py-24 md:px-10">
        <div className="grid gap-10 md:grid-cols-2">
          <h1 className="font-display text-4xl leading-tight text-ink">About NC4SCM</h1>
          <p className="text-base leading-relaxed text-stone">
            The National Center for Sustainable Construction Materials
            (NC4SCM) is dedicated to accelerating the adoption of low-carbon
            construction technologies. Through applied research, rigorous
            material characterization, and close collaboration with industry
            and academic partners, we work to reduce the environmental
            footprint of the built environment without compromising
            structural performance.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          TEAM DIRECTORY — multi-column card matrix
      ------------------------------------------------------------------ */}
      <section className="mx-auto max-w-content px-6 py-16 md:px-10">
        <h2 className="font-display text-2xl text-ink">Team Directory</h2>
        <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {team && team.length > 0 ? (
            team.map((member) => {
              const avatarUrl = urlFor(member.avatar)?.width(400).height(400).url()
              return (
                <div key={member._id}>
                  {avatarUrl && (
                    <div className="relative aspect-square w-full overflow-hidden bg-stone/10 grayscale transition-all duration-500 hover:grayscale-0">
                      <Image
                        src={avatarUrl}
                        alt={member.avatar?.alt || member.fullName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <p className="mt-4 font-display text-lg text-ink">{member.fullName}</p>
                  <p className="text-sm text-stone">{member.position}</p>
                </div>
              )
            })
          ) : (
            <p className="text-sm text-stone">Team members will appear here once published.</p>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------------
          INSTITUTIONAL PARTNERS MATRIX — quiet, grayscale logo grid that
          only reveals color/link affordance on hover, keeping the section
          visually calm.
      ------------------------------------------------------------------ */}
      <section className="mx-auto max-w-content px-6 py-16 md:px-10">
        <h2 className="font-display text-2xl text-ink">Institutional Partners</h2>
        <div className="mt-10 grid grid-cols-2 gap-10 sm:grid-cols-3 md:grid-cols-5">
          {partners && partners.length > 0 ? (
            partners.map((partner) => {
              const logoUrl = urlFor(partner.logo)?.width(240).height(120).fit('max').url()
              return (
                <Link
                  key={partner._id}
                  href={partner.targetUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                >
                  {logoUrl && (
                    <Image
                      src={logoUrl}
                      alt={partner.logo?.alt || partner.organizationName}
                      width={140}
                      height={70}
                      className="h-auto w-full object-contain"
                    />
                  )}
                </Link>
              )
            })
          ) : (
            <p className="text-sm text-stone">Partner organizations will appear here once published.</p>
          )}
        </div>
      </section>
    </>
  )
}
