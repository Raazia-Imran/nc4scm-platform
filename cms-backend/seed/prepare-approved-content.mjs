import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const here = new URL("./", import.meta.url);
export async function prepareContent() {
  const source = JSON.parse(
    await readFile(new URL("approved-content.source.json", here), "utf8"),
  );
  // Freeze the defaults used by this completed migration so later UI labels
  // cannot change its hash or overwrite client edits when Studio is deployed.
  const ui = JSON.parse(
    await readFile(new URL("approved-interface-text.json", here), "utf8"),
  );
  const tables = source.tables.map((rows) =>
    Object.fromEntries(rows.map((row) => [row.field, row])),
  );
  const approved = (table, field) => tables[table][field].approved.trim();
  const current = (table, field) => tables[table][field].current.trim();
  const keep = (table, field) =>
    approved(table, field).replace(/^Keep As Is — /, "");
  const bullets = (value) =>
    value
      .split("\n")
      .map((line) => line.replace(/^•\s*/, "").trim())
      .filter((line) => line && line !== ".");
  const contacts = current(0, "Phone / Key Contacts")
    .split("\n")
    .map((line, i) => {
      const [, name, email, phone] = line.match(/^(.+): (\S+) \((.+)\)$/);
      return { _key: `contact-${i}`, name, email, phone };
    });
  const documents = [
    {
      type: "siteSettings",
      id: "siteSettings",
      set: {
        organizationName: approved(0, "Organization Name"),
        shortName: approved(0, "Short Name"),
        missionLine: approved(0, "Footer Mission Line"),
        address: current(0, "Address"),
        email: current(0, "Email"),
        contactPeople: contacts,
        linkedinUrl: approved(0, "LinkedIn URL"),
        latitude: 24.933469,
        longitude: 67.111924,
        copyrightText: current(0, "Copyright Text"),
      },
      defaults: {
        navigation: [
          "About",
          "Services",
          "Research",
          "Events",
          "News",
          "Contact",
        ].map((label, i) => ({
          _key: `nav-${i}`,
          _type: "link",
          label,
          href: [
            "/about",
            "/services",
            "/publications",
            "/events",
            "/news",
            "/contact",
          ][i],
        })),
        interfaceText: ui,
      },
    },
  ];
  const page = {};
  for (const [field, prefix] of [
    ["Services", "services"],
    ["Research", "research"],
    ["Events", "events"],
    ["News", "news"],
    ["Contact", "contact"],
  ]) {
    const value = approved(1, `${field} Headline & Intro`);
    const [heading, introduction] = value.split("\nIntroduction: ");
    page[`${prefix}Headline`] = heading.replace(/^Heading: /, "");
    page[`${prefix}Introduction`] = introduction;
  }
  page.contactSuccessMessage = approved(1, "Contact Success Message");
  documents.push({ type: "pageSettings", id: "pageSettings", set: page });
  for (let i = 2; i <= 5; i++) {
    const slug = keep(i, "Slug");
    documents.push({
      type: "service",
      id: `service-${slug}`,
      slug,
      set: {
        title: approved(i, "Portfolio Name"),
        slug: { _type: "slug", current: slug },
        summary: approved(i, "Short Summary"),
        body: [
          {
            _type: "block",
            _key: "description",
            style: "normal",
            markDefs: [],
            children: [
              {
                _type: "span",
                _key: "text",
                text: approved(i, "Full Description"),
                marks: [],
              },
            ],
          },
        ],
        methods: bullets(approved(i, "Methods & Capabilities")),
        deliverables: bullets(approved(i, "Typical Deliverables")),
        displayOrder: Number(keep(i, "Display Order")),
      },
    });
  }
  documents.push({
    type: "homePage",
    id: "homePage",
    set: {
      servicesHeading: page.servicesHeadline,
      servicesIntro: page.servicesIntroduction,
    },
  });
  const payload = {
    version: "client-word-2026-10-11",
    source: { file: source.file, sha256: source.sha256 },
    documents,
  };
  payload.hash = createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");
  return payload;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const payload = await prepareContent();
  await writeFile(
    new URL("approved-content.json", here),
    `${JSON.stringify(payload, null, 2)}\n`,
  );
  console.log(
    `Prepared ${payload.documents.length} field-level updates from ${payload.source.file}. No images or unconfirmed testimonials included.`,
  );
}
