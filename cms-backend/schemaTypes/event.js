// schemaTypes/event.js
// -----------------------------------------------------------------------------
// Defines the "event" document type for the Events Engine. A single
// `eventDateTime` field (datetime, not just date) lets the frontend compare
// against `new Date()` to dynamically split events into "Upcoming" and
// "Past" buckets without any manual tagging by editors.
// -----------------------------------------------------------------------------
export default {
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          {title: 'International Conference', value: 'conference'},
          {title: 'Academic Seminar', value: 'seminar'},
          {title: 'Technical Workshop', value: 'workshop'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'eventDateTime',
      title: 'Event Date & Time',
      type: 'datetime',
      description: 'The exact execution date/time. Used to sort events into Upcoming vs Past.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'venue',
      title: 'Venue Location',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    },
  ],
  orderings: [
    {
      title: 'Event Date, Soonest First',
      name: 'eventDateTimeAsc',
      by: [{field: 'eventDateTime', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title', subtitle: 'eventType', date: 'eventDateTime'},
    prepare({title, subtitle, date}) {
      return {title, subtitle: `${subtitle} — ${date ? new Date(date).toLocaleDateString() : 'TBD'}`}
    },
  },
}
