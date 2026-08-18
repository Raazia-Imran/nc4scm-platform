// schemaTypes/publication.js
// -----------------------------------------------------------------------------
// Defines the "publication" document type that powers the Research Hub's
// Technical Publications Vault. Publications can reference multiple
// teamMember documents as authors (a many-to-many relationship modeled with
// Sanity's `reference` type) and carry an uploaded PDF file that the
// frontend links to directly for download.
// -----------------------------------------------------------------------------
export default {
  name: "publication",
  title: "Publication",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Paper Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "releaseDate",
      title: "Release Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "category",
      title: "Category Tag",
      type: "string",
      description: "Used for filtering in the Publications Vault search UI.",
      options: {
        list: [
          { title: "LC3 Technology", value: "lc3-technology" },
          {
            title: "Material Characterization",
            value: "material-characterization",
          },
          {
            title: "New Material Development",
            value: "new-material-development",
          },
          { title: "Technological Support", value: "technological-support" },
          { title: "General Research", value: "general-research" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "journal",
      title: "Journal or conference",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    { name: "doiUrl", title: "DOI URL", type: "url" },
    {
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    },
    {
      name: "authors",
      title: "Authors",
      type: "array",
      description: "Link this publication to one or more Team Member records.",
      of: [{ type: "reference", to: [{ type: "teamMember" }] }],
      validation: (Rule) =>
        Rule.min(1).error("At least one author must be linked."),
    },
    {
      name: "abstract",
      title: "Abstract",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required(),
    },
    {
      name: "pdfFile",
      title: "PDF File",
      type: "file",
      options: { accept: ".pdf" },
      validation: (Rule) => Rule.required(),
    },
  ],
  orderings: [
    {
      title: "Release Date, Newest First",
      name: "releaseDateDesc",
      by: [{ field: "releaseDate", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "category", date: "releaseDate" },
    prepare({ title, subtitle, date }) {
      return { title, subtitle: `${subtitle} — ${date || "no date"}` };
    },
  },
};
