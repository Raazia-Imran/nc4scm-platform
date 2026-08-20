// schemaTypes/publication.js
// -----------------------------------------------------------------------------
// Citation-oriented publication records for the Research Hub.
//
// Author names are stored in citation order as plain text because publications
// regularly include external collaborators who should not be represented as
// NC4SCM team members. Optional team-member references can still connect a
// paper to profiles maintained elsewhere in the Studio.
//
// Abstracts, exact dates, keywords, and distributable PDFs are deliberately
// optional. Editors must be able to publish verified bibliographic metadata
// without inventing content or uploading a publisher PDF without permission.
// -----------------------------------------------------------------------------
export default {
  name: "publication",
  title: "Publication",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Paper title",
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
      name: "publicationType",
      title: "Publication type",
      type: "string",
      options: {
        list: [
          { title: "Journal article", value: "journal-article" },
          {
            title: "Conference paper / proceedings chapter",
            value: "conference-paper",
          },
          { title: "Book chapter", value: "book-chapter" },
          { title: "Technical report", value: "technical-report" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "publicationYear",
      title: "Publication year",
      type: "number",
      description:
        "Use the year printed in the official citation. Add an exact date below only when it has been verified.",
      validation: (Rule) => Rule.required().integer().min(1900).max(2100),
    },
    {
      name: "releaseDate",
      title: "Exact publication date",
      type: "date",
      description: "Optional. Do not estimate a month or day from the year alone.",
    },
    {
      name: "category",
      title: "Research category",
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
      name: "authors",
      title: "Authors",
      type: "array",
      description:
        "Enter every author exactly as shown in the official citation and preserve the published order.",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      validation: (Rule) =>
        Rule.required().min(1).unique().error("Add at least one author."),
    },
    {
      name: "teamAuthors",
      title: "Related NC4SCM team profiles",
      type: "array",
      description:
        "Optional internal links. These do not replace or reorder the citation author list above.",
      of: [{ type: "reference", to: [{ type: "teamMember" }] }],
      validation: (Rule) => Rule.unique(),
    },
    {
      name: "journal",
      title: "Journal, conference, or book",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "publisher",
      title: "Publisher",
      type: "string",
    },
    {
      name: "doiUrl",
      title: "DOI URL",
      type: "url",
      description: "Use the canonical form: https://doi.org/10.…",
      validation: (Rule) =>
        Rule.uri({ scheme: ["https"] }).custom((value) =>
          !value || value.startsWith("https://doi.org/")
            ? true
            : "Use the canonical https://doi.org/… address.",
        ),
    },
    {
      name: "keywords",
      title: "Keywords",
      type: "array",
      description: "Optional. Prefer publisher- or author-supplied keywords.",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      validation: (Rule) => Rule.unique(),
    },
    {
      name: "abstract",
      title: "Abstract",
      type: "text",
      rows: 6,
      description:
        "Optional. Add only client-approved or appropriately licensed text; do not copy a restricted publisher abstract by default.",
    },
    {
      name: "pdfFile",
      title: "Distributable PDF",
      type: "file",
      description:
        "Optional. Upload only an author-approved or openly licensed copy that NC4SCM is permitted to distribute.",
      options: { accept: ".pdf" },
    },
  ],
  orderings: [
    {
      title: "Publication year, newest first",
      name: "publicationYearDesc",
      by: [
        { field: "publicationYear", direction: "desc" },
        { field: "releaseDate", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      venue: "journal",
      year: "publicationYear",
    },
    prepare({ title, venue, year }) {
      return {
        title,
        subtitle: [venue, year].filter(Boolean).join(" — "),
      };
    },
  },
};
