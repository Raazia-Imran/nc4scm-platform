// schemaTypes/service.js
// -----------------------------------------------------------------------------
// Defines the "service" document type. NC4SCM offers exactly four services
// (LC3 Technology, Material Characterization, New Material Development,
// Technological Support) but this schema is intentionally generic so any
// number of services can be added later without a code change.
// -----------------------------------------------------------------------------
export default {
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Portfolio Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'summary',
      title: 'Short Summary',
      type: 'string',
      description: 'Displayed on the service overview cards. Keep it punchy.',
      validation: (Rule) =>
        Rule.required()
          .max(120)
          .error('Summary must be 120 characters or fewer so it fits the card layout.'),
    },
    {
      name: 'body',
      title: 'Full Description',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Rich text layout shown on the full Services page.',
    },
    {
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first in the services grid.',
      initialValue: 0,
    },
  ],
  orderings: [
    {
      title: 'Display Order, Ascending',
      name: 'displayOrderAsc',
      by: [{field: 'displayOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title', subtitle: 'summary'},
  },
}
