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
      name: "contractStatus",
      title: "Contract status",
      type: "string",
      initialValue: "active",
      options: {
        list: [
          { title: "Active / automatic by end date", value: "active" },
          { title: "Contract ended", value: "ended" },
        ],
        layout: "radio",
      },
      description:
        "Mark ended to show the complete profile in Living Legacy. Leaving this active still respects an end date.",
    },
    { name: "contractStartDate", title: "Contract start date", type: "date" },
    {
      name: "contractEndDate",
      title: "Contract end date",
      type: "date",
      description:
        "The last active day, in Pakistan time. The profile moves to Living Legacy after this day, without a deployment.",
      validation: (Rule) =>
        Rule.custom(
          (value, context) =>
            !value ||
            !context.document?.contractStartDate ||
            value >= context.document.contractStartDate ||
            "End date must not precede start date.",
        ),
    },
    {
      name: "keepMainCredit",
      title: "Keep lasting credit on the main team page",
      type: "boolean",
      initialValue: false,
      description:
        "Retain a credited contributor card on About after the contract ends, while also showing the full profile in Living Legacy. It is labelled as a lasting contribution, not current employment.",
    },
    {
      name: "contributionSummary",
      title: "Contribution to the centre",
      type: "text",
      rows: 4,
    },
    {
      name: "contributionHighlights",
      title: "Contribution highlights",
      type: "array",
      of: [{ type: "string" }],
    },

    {
      name: "hideFromDirectory",
      title: "Hide from public team directory",
      type: "boolean",
      initialValue: false,
      description:
        "Hide this person from both public directories. Their CMS profile is preserved.",
    },
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
          { title: "Web and digital platforms", value: "digital-platforms" },
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
    {
      name: "secondaryEmail",
      title: "Additional public email",
      type: "string",
    },
    { name: "linkedinUrl", title: "LinkedIn URL", type: "url" },
    { name: "githubUrl", title: "GitHub URL", type: "url" },
    { name: "profileUrl", title: "Official academic profile", type: "url" },
    { name: "orcidUrl", title: "ORCID URL", type: "url" },
    { name: "googleScholarUrl", title: "Google Scholar URL", type: "url" },
    { name: "researchGateUrl", title: "ResearchGate URL", type: "url" },
    {
      name: "displayPriority",
      title: "Display Priority",
      type: "number",
      description:
        "Lower numbers are shown first in the Team Directory grid (e.g. 1 = shown first).",
      validation: (Rule) => Rule.required().integer().min(0),
    },
    {
      name: "cardSummary",
      title: "Short directory summary",
      type: "text",
      rows: 3,
      description:
        "Two short third-person sentences about qualifications and research focus. Full details remain in Biography.",
      validation: (Rule) => Rule.max(400),
    },
    {
      name: "researchInterests",
      title: "Research interests",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.max(6),
    },
    { name: "qualification", title: "Qualification summary", type: "string" },
    {
      name: "portraitPlaceholder",
      title: "Portrait placeholder",
      type: "string",
      options: {
        list: [
          { title: "Neutral illustration", value: "neutral" },
          { title: "Female illustration", value: "female" },
        ],
      },
      description: "Only used when no portrait has been provided.",
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
