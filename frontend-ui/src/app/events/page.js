// src/app/events/page.js
// -----------------------------------------------------------------------------
// The Events Engine. All events (conferences, seminars, workshops) are
// fetched in a single query, then split into "Upcoming" and "Past" buckets
// purely by comparing each event's `eventDateTime` against the current
// server time — editors never have to manually flag an event as past.
//
// Because this comparison happens in a Server Component at request time,
// the split is always correct as of the moment someone loads the page,
// with no client-side JavaScript required.
// -----------------------------------------------------------------------------
import {client} from '@/sanityClient'

const EVENTS_QUERY = `*[_type == "event"] | order(eventDateTime asc){
  _id, title, eventType, eventDateTime, venue, description
}`

const EVENT_TYPE_LABELS = {
  conference: 'International Conference',
  seminar: 'Academic Seminar',
  workshop: 'Technical Workshop',
}

export const metadata = {
  title: 'Events — NC4SCM',
}

function formatEventDate(isoString) {
  return new Date(isoString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function EventCard({event}) {
  return (
    <article className="border-t border-stone/30 py-6">
      <p className="text-xs uppercase tracking-widest text-accent">
        {EVENT_TYPE_LABELS[event.eventType] || event.eventType}
      </p>
      <h3 className="mt-2 font-display text-xl text-ink">{event.title}</h3>
      <p className="mt-1 text-sm text-stone">
        {formatEventDate(event.eventDateTime)} — {event.venue}
      </p>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/80">{event.description}</p>
    </article>
  )
}

export default async function EventsPage() {
  const events = await client.fetch(EVENTS_QUERY)
  const now = Date.now()

  // Defensive default: if the query somehow returns null (e.g. transient
  // network issue), fall back to an empty array rather than crashing the
  // page on `.filter`.
  const allEvents = events || []

  const upcomingEvents = allEvents
    .filter((event) => new Date(event.eventDateTime).getTime() >= now)
    .sort((a, b) => new Date(a.eventDateTime) - new Date(b.eventDateTime))

  const pastEvents = allEvents
    .filter((event) => new Date(event.eventDateTime).getTime() < now)
    .sort((a, b) => new Date(b.eventDateTime) - new Date(a.eventDateTime))

  return (
    <section className="mx-auto max-w-content px-6 py-24 md:px-10">
      <h1 className="font-display text-4xl leading-tight text-ink">Events Engine</h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-stone">
        Conferences, seminars, and workshops hosted or co-hosted by NC4SCM.
      </p>

      <div className="mt-16 grid gap-16 md:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl text-ink">Upcoming Live Events</h2>
          <div className="mt-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => <EventCard key={event._id} event={event} />)
            ) : (
              <p className="border-t border-stone/30 py-6 text-sm text-stone">
                No upcoming events scheduled at this time.
              </p>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl text-ink">Past Archive History</h2>
          <div className="mt-4">
            {pastEvents.length > 0 ? (
              pastEvents.map((event) => <EventCard key={event._id} event={event} />)
            ) : (
              <p className="border-t border-stone/30 py-6 text-sm text-stone">
                No past events recorded yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
