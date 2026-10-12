// schemaTypes/news.js
// -----------------------------------------------------------------------------
// Defines the "news" document type for the News Bulletin. Each news item has
// a unique slug used for dynamic routing at /news/[slug] on the frontend.
// -----------------------------------------------------------------------------
export default {
  name: "news",
  title: "News Article",
  type: "document",
  fields: [
    {
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Used to build the article URL: /news/<slug>",
      options: { source: "headline", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Center update", value: "update" },
          { title: "Milestone", value: "milestone" },
          { title: "Media coverage", value: "media" },
          { title: "Announcement", value: "announcement" },
          { title: "Recognition", value: "recognition" },
          { title: "Industry engagement", value: "industry-engagement" },
          { title: "Global engagement", value: "global-engagement" },
          { title: "Research", value: "research" },
          { title: "Policy engagement", value: "policy-engagement" },
          { title: "Public engagement", value: "public-engagement" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "excerpt",
      title: "Card preview",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required().max(220),
    },
    {
      name: "publishedAt",
      title: "Published Timestamp",
      type: "datetime",
    },
    {
      name: "externalUrl",
      title: "Original external source",
      type: "url",
      description:
        "Optional source link displayed inside the article. News cards always open the full article on this website.",
    },
    {
      name: "coverImage",
      title: "Cover Graphic",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
      ],
    },
    {
      name: "gallery",
      title: "Article photo gallery",
      type: "array",
      description: "Additional photographs in a compact viewer. Drag to reorder. The cover photo remains separate; inline photos can also be added in Article Body.",
      of: [{ type: "image", options: { hotspot: true }, fields: [
        { name: "alt", title: "Alternative text", type: "string", validation: (Rule) => Rule.required() },
        { name: "caption", title: "Caption", type: "string" },
      ] }],
    },
    {
      name: "body",
      title: "Article Body",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", title: "Alternative text", type: "string", validation: (Rule) => Rule.required() },
            { name: "caption", title: "Caption", type: "string" },
          ],
        },
      ],
      description: "Full article shown after opening a card. Add paragraphs, headings, lists and as many relevant photographs as needed. Add a description and optional caption to each photo.",
    },
  ],
  orderings: [
    {
      title: "Published, Newest First",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "headline", subtitle: "publishedAt", media: "coverImage" },
  },
};
