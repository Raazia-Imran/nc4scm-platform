// schemaTypes/teamMember.js
// -----------------------------------------------------------------------------
// Defines the "teamMember" document type used to power the Team Directory
// section of the About Hub. Each field below becomes an input in the Studio
// UI, and the `validation` rules stop editors from publishing incomplete or
// malformed content — this is our first line of defense for data safety,
// long before anything reaches the frontend.
// -----------------------------------------------------------------------------
export default {
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    {
      name: "fullName",
      title: "Full Name",
      type: "string",
      validation: (Rule) =>
        Rule.required().error("A team member must have a full name."),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Auto-generated URL-safe identifier, derived from the full name.",
      options: { source: "fullName", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "position",
      title: "Position / Role",
      type: "string",
      description: 'e.g. "Senior Materials Scientist", "Lab Director"',
      validation: (Rule) => Rule.required(),
    },
    {
      name: "group",
      title: "Team group",
      type: "string",
      options: {
        list: [
          { title: "Principal Investigator", value: "principal-investigator" },
          {
            title: "Co-Principal Investigator",
            value: "co-principal-investigator",
          },
          { title: "Project Management", value: "project-management" },
          { title: "Finance", value: "finance" },
          { title: "Research Staff", value: "research-staff" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "avatar",
      title: "Avatar Image",
      type: "image",
      description: "Optional until an approved portrait is available.",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alternative text",
          type: "string",
          description: "Important for accessibility and SEO.",
          validation: (Rule) => Rule.required(),
        },
      ],
    },
    { name: "email", title: "Public email", type: "string" },
    { name: "secondaryEmail", title: "Additional public email", type: "string" },
    { name: "linkedinUrl", title: "LinkedIn URL", type: "url" },
    { name: "profileUrl", title: "Official academic profile", type: "url" },
    {
      name: "displayPriority",
      title: "Display Priority",
      type: "number",
      description:
        "Lower numbers are shown first in the Team Directory grid (e.g. 1 = shown first).",
      validation: (Rule) => Rule.required().integer().min(0),
    },
    { name: "cardSummary", title: "Short directory summary", type: "text", rows: 3, description: "Two short third-person sentences about qualifications and research focus. Full details remain in Biography.", validation: Rule => Rule.max(400) },
    { name: "researchInterests", title: "Research interests", type: "array", of: [{type:"string"}], validation: Rule => Rule.max(6) },
    { name: "qualification", title: "Qualification summary", type: "string" },
    { name: "portraitPlaceholder", title: "Portrait placeholder", type: "string", options: {list:[{title:"Neutral illustration",value:"neutral"},{title:"Female illustration",value:"female"}]}, description: "Only used when no portrait has been provided." },
    {
      name: "bio",
      title: "Biography",
      type: "array",
      of: [{ type: "block" }],
      description: "Rich text biography, rendered on the About page.",
    },
  ],
  // orderings lets Studio users sort the document list view by priority
  // without needing to open every document individually.
  orderings: [
    {
      title: "Display Priority, Ascending",
      name: "displayPriorityAsc",
      by: [{ field: "displayPriority", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "fullName", subtitle: "position", media: "avatar" },
  },
};
