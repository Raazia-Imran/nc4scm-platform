export default {
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    {
      name: "quote",
      title: "Testimonial",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required(),
    },
    {
      name: "personName",
      title: "Person name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    { name: "role", title: "Role / designation", type: "string" },
    { name: "organization", title: "Organization", type: "string" },
    {
      name: "portrait",
      title: "Portrait",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alternative text", type: "string" }],
    },
    { name: "displayOrder", title: "Display order", type: "number" },
    { name: "published", title: "Show on website", type: "boolean", initialValue: true },
  ],
  orderings: [{ title: "Display order", name: "displayOrder", by: [{ field: "displayOrder", direction: "asc" }] }],
  preview: {
    select: { title: "personName", subtitle: "organization", media: "portrait" },
  },
};
