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
          { title: "Research Staff", value: "research-staff" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "avatar",
      title: "Avatar Image",
      type: "image",
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
      validation: (Rule) => Rule.required(),
    },
    { name: "email", title: "Public email", type: "string" },
    { name: "linkedinUrl", title: "LinkedIn URL", type: "url" },
    {
      name: "displayPriority",
      title: "Display Priority",
      type: "number",
      description:
        "Lower numbers are shown first in the Team Directory grid (e.g. 1 = shown first).",
      validation: (Rule) => Rule.required().integer().min(0),
    },
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
