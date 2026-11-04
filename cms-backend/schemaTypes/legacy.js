const photoFields = [
  {
    name: "alt",
    title: "Alternative text",
    type: "string",
    validation: (Rule) => Rule.required(),
  },
  {
    name: "caption",
    title: "Photo caption",
    type: "string",
    validation: (Rule) => Rule.required(),
  },
  { name: "credit", title: "Photographer / image credit", type: "string" },
];
export const archivePhoto = {
  name: "archivePhoto",
  title: "Captioned photograph",
  type: "image",
  options: { hotspot: true },
  fields: photoFields,
};
export const legacyPage = {
  name: "legacyPage",
  title: "Centre Archive page",
  type: "document",
  fields: [
    { name: "eyebrow", title: "Eyebrow", type: "string" },
    { name: "headline", title: "Headline", type: "string" },
    { name: "introduction", title: "Introduction", type: "text", rows: 3 },
    { name: "heroImage", title: "Hero photograph", type: "archivePhoto" },
    ...["people", "projects", "practice"].flatMap((section) => [
      {
        name: `${section}Heading`,
        title: `${section} heading`,
        type: "string",
      },
      {
        name: `${section}Introduction`,
        title: `${section} introduction`,
        type: "text",
        rows: 3,
      },
    ]),
  ],
  preview: { prepare: () => ({ title: "Centre Archive page" }) },
};
export const contributionProject = {
  name: "contributionProject",
  title: "Legacy project",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Project title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Page URL",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "projectType",
      title: "Project category",
      type: "string",
      options: {
        list: [
          { title: "Student / FYDP", value: "student" },
          { title: "Research project", value: "research" },
          { title: "Industry collaboration", value: "industry" },
        ],
      },
      initialValue: "student",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "year",
      title: "Completion year",
      type: "number",
      validation: (Rule) => Rule.required().integer().min(1900).max(2200),
    },
    {
      name: "summary",
      title: "Short summary",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(500),
    },
    { name: "coverImage", title: "Cover photograph", type: "archivePhoto" },
    {
      name: "participants",
      title: "Student / project team names",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "supervisors",
      title: "Supervisors",
      type: "array",
      of: [{ type: "reference", to: [{ type: "teamMember" }] }],
    },
    {
      name: "supervisorNames",
      title: "Other supervisor names",
      type: "array",
      of: [{ type: "string" }],
    },
    { name: "institution", title: "Institution / department", type: "string" },
    {
      name: "body",
      title: "Project story",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "outcomes",
      title: "Outcomes / contribution",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "gallery",
      title: "Project photographs",
      type: "array",
      of: [{ type: "archivePhoto" }],
    },
    {
      name: "projectUrl",
      title: "Public project / publication link",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["https"] }),
    },
    {
      name: "publicationApproved",
      title: "Approved for public display",
      type: "boolean",
      initialValue: false,
      description:
        "Publish only approved names, photographs and project information. This switch controls display on the website.",
    },
    {
      name: "displayOrder",
      title: "Display order",
      type: "number",
      initialValue: 100,
    },
  ],
  preview: {
    select: { title: "title", subtitle: "projectType", media: "coverImage" },
  },
};
export const practicalContributor = {
  name: "practicalContributor",
  title: "Practical contribution",
  type: "document",
  fields: [
    {
      name: "fullName",
      title: "Public name / team name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "role",
      title: "Trade / practical role",
      type: "string",
      description:
        "For example: technician, mason, workshop or materials preparation.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "contribution",
      title: "Contribution summary",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    },
    { name: "period", title: "Contribution period", type: "string" },
    {
      name: "skills",
      title: "Skills / work areas",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "portrait",
      title: "Approved portrait / work photograph",
      type: "archivePhoto",
    },
    {
      name: "story",
      title: "Full contribution story",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "gallery",
      title: "Work photographs",
      type: "array",
      of: [{ type: "archivePhoto" }],
    },
    {
      name: "relatedProjects",
      title: "Related projects",
      type: "array",
      of: [{ type: "reference", to: [{ type: "contributionProject" }] }],
    },
    {
      name: "publicationApproved",
      title: "Approved for public display",
      type: "boolean",
      initialValue: false,
      description:
        "Obtain approval to publish the person’s name, story and photos. Do not enter private identity, payroll or home address details.",
    },
    {
      name: "displayOrder",
      title: "Display order",
      type: "number",
      initialValue: 100,
    },
  ],
  preview: {
    select: { title: "fullName", subtitle: "role", media: "portrait" },
  },
};
