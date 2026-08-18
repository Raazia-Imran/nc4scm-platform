export default {
  name: "pageSettings",
  title: "Page Headings & Contact",
  type: "document",
  fields: [
    { name: "servicesHeadline", title: "Services headline", type: "string" },
    {
      name: "servicesIntroduction",
      title: "Services introduction",
      type: "text",
      rows: 3,
    },
    { name: "researchHeadline", title: "Research headline", type: "string" },
    {
      name: "researchIntroduction",
      title: "Research introduction",
      type: "text",
      rows: 3,
    },
    { name: "eventsHeadline", title: "Events headline", type: "string" },
    {
      name: "eventsIntroduction",
      title: "Events introduction",
      type: "text",
      rows: 3,
    },
    { name: "newsHeadline", title: "News headline", type: "string" },
    {
      name: "newsIntroduction",
      title: "News introduction",
      type: "text",
      rows: 3,
    },
    { name: "contactHeadline", title: "Contact headline", type: "string" },
    {
      name: "contactIntroduction",
      title: "Contact introduction",
      type: "text",
      rows: 3,
    },
    {
      name: "contactSuccessMessage",
      title: "Contact success message",
      type: "text",
      rows: 2,
    },
  ],
  preview: { prepare: () => ({ title: "Page headings and contact copy" }) },
};
