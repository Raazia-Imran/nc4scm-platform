// schemaTypes/news.js
// -----------------------------------------------------------------------------
// Defines the "news" document type for the News Bulletin. Each news item has
// a unique slug used for dynamic routing at /news/[slug] on the frontend.
// -----------------------------------------------------------------------------
export default {
  name: 'news',
  title: 'News Article',
  type: 'document',
  fields: [
    {
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Used to build the article URL: /news/<slug>',
      options: {source: 'headline', maxLength: 96},
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: 'Published Timestamp',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'coverImage',
      title: 'Cover Graphic',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'body',
      title: 'Article Body',
      type: 'array',
      of: [
        {type: 'block'},
        {
          type: 'image',
          options: {hotspot: true},
          fields: [{name: 'alt', title: 'Alternative text', type: 'string'}],
        },
      ],
      description: 'Full rich-text content body, supports inline images.',
      validation: (Rule) => Rule.required(),
    },
  ],
  orderings: [
    {
      title: 'Published, Newest First',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'headline', subtitle: 'publishedAt', media: 'coverImage'},
  },
}
