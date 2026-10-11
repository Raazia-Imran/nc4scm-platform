// schemaTypes/event.js
// -----------------------------------------------------------------------------
// Defines the "event" document type for the Events Engine. A single
// `eventDateTime` field (datetime, not just date) lets the frontend compare
// against `new Date()` to dynamically split events into "Upcoming" and
// "Past" buckets without any manual tagging by editors.
// -----------------------------------------------------------------------------
export default {
  name: "event",
  title: "Event",
  type: "document",
  groups: [
    { name: "details", title: "Event details", default: true },
    { name: "recap", title: "After the event" },
  ],
  fields: [
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "eventType",
      title: "Event Type",
      type: "string",
      options: {
        list: [
          { title: "International Conference", value: "conference" },
          { title: "Academic Seminar", value: "seminar" },
          { title: "Technical Workshop", value: "workshop" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "eventDateTime",
      title: "Event Date & Time",
      type: "datetime",
      description:
        "The exact execution date/time. Used to sort events into Upcoming vs Past.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "endDateTime",
      title: "Event end date & time",
      type: "datetime",
      description:
        "Optional. Multi-day events remain upcoming until this time.",
      validation: (Rule) =>
        Rule.custom(
          (value, context) =>
            !value ||
            new Date(value) >= new Date(context.document.eventDateTime) ||
            "End time must follow the start time.",
        ),
    },
    {
      name: "venue",
      title: "Venue Location",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required(),
    },
    {
      name: "speakers",
      title: "Speakers",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "registrationUrl",
      title: "Registration or external link",
      type: "url",
    },
    {
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alternative text", type: "string" }],
    },
    {
      name: "gallery",
      group: "recap",
      title: "Past event gallery",
      description:
        "Add, reorder or replace photographs after the event. Visitors can switch photos in a compact gallery. Add alternative text and optional captions to each photo.",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Alternative text",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            { name: "caption", title: "Caption", type: "string" },
          ],
        },
      ],
    },
    {
      name: "pastEventRecap",
      group: "recap",
      title: "Past event recap",
      type: "text",
      rows: 3,
      description:
        "After the event, add a short summary of what happened, key outcomes, and notable participation.",
    },
    {
      name: "keyOutcomes",
      title: "Key outcomes",
      group: "recap",
      description: "Optional short bullets about what happened or was achieved. These appear after the event ends.",
      type: "array",
      of: [{ type: "string" }],
    },
  ].map((field) => ({ ...field, group: field.group || "details" })),
  orderings: [
    {
      title: "Event Date, Soonest First",
      name: "eventDateTimeAsc",
      by: [{ field: "eventDateTime", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "eventType", date: "eventDateTime" },
    prepare({ title, subtitle, date }) {
      return {
        title,
        subtitle: `${subtitle} — ${date ? new Date(date).toLocaleDateString() : "TBD"}`,
      };
    },
  },
};
