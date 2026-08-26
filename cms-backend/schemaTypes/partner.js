// schemaTypes/partner.js
// -----------------------------------------------------------------------------
// Defines the "partner" document type, used to populate the Institutional
// Partners Matrix (a logo grid) on the About Hub.
// -----------------------------------------------------------------------------
export default {
  name: "partner",
  title: "Institutional Partner",
  type: "document",
  fields: [
    {
      name: "organizationName",
      title: "Organization Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "category",
      title: "Partner category",
      type: "string",
      options: {
        list: [
          { title: "Funder", value: "funder" },
          { title: "Academic", value: "academic" },
          { title: "Industry", value: "industry" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "logo",
      title: "Logo",
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
      validation: (Rule) => Rule.required(),
    },
    {
      name: "targetUrl",
      title: "Target External URL",
      type: "url",
      description: "Where users are taken when they click this logo.",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https"],
        }),
    },
  ],
  preview: {
    select: { title: "organizationName", media: "logo" },
  },
};
