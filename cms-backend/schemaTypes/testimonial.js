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
    {
      name: "published",
      title: "Show on website",
      type: "boolean",
      initialValue: false,
      validation: Rule => Rule.custom((value,context) => !value || context.document.publicationApproved === true || "Confirm quotation approval before showing it on the website."),
    },
    {
      name: "publicationApproved",
      title: "Quotation approved for publication",
      type: "boolean",
      initialValue: false,
      description:
        "Confirm the author has approved the quotation before showing it on the website.",
    },
  ],
  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [{ field: "displayOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "personName",
      subtitle: "organization",
      media: "portrait",
    },
  },
};
