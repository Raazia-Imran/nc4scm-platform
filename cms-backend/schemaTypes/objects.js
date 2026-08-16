export const link = {
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    {
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "href",
      title: "URL or path",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "openInNewTab",
      title: "Open in a new tab",
      type: "boolean",
      initialValue: false,
    },
  ],
};

export const seo = {
  name: "seo",
  title: "Search and social sharing",
  type: "object",
  fields: [
    {
      name: "metaTitle",
      title: "Page title",
      type: "string",
      validation: (Rule) => Rule.max(60),
    },
    {
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(160),
    },
    {
      name: "shareImage",
      title: "Social sharing image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "hideFromSearch",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    },
  ],
};

export const statistic = {
  name: "statistic",
  title: "Impact statistic",
  type: "object",
  fields: [
    {
      name: "value",
      title: "Value",
      type: "string",
      description: "Examples: 40%, 12, PKR 25M",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    { name: "note", title: "Supporting note", type: "string" },
  ],
};
