// Local test API. Never imported by production code or bundled into the site.
import { createServer } from "node:http";
import { parse, evaluate } from "groq-js";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { homeStory } from "../seed/home-story.mjs";
import { homeRefresh } from "../seed/home-refresh.mjs";
import { prepareContent } from "../seed/prepare-approved-content.mjs";
import { hydrateMedia } from "../seed/editorial-plan.mjs";

export async function fixtureDocuments() {
  const docs = (
    await readFile(
      new URL("../seed/client-content.ndjson", import.meta.url),
      "utf8",
    )
  )
    .trim()
    .split("\n")
    .map(JSON.parse);
  const publications = (
    await readFile(
      new URL("../seed/publications.ndjson", import.meta.url),
      "utf8",
    )
  )
    .trim()
    .split("\n")
    .map(JSON.parse);
  docs.push(...publications);
  const payload = await prepareContent();
  for (const entry of payload.documents) {
    let doc = docs.find(
      (doc) =>
        doc._type === entry.type &&
        (!entry.slug || doc.slug?.current === entry.slug),
    );
    if (!doc) {
      doc = { _id: entry.id, _type: entry.type };
      docs.push(doc);
    }
    Object.assign(doc, entry.defaults, entry.set);
  }
  const home = docs.find(doc => doc._type === "homePage");
  Object.assign(home, await homeRefresh(), await homeStory());
  delete home.statistics;
  delete home.flagshipTitle;
  home.institutionLogos = ["NC4SCM", "NED University", "Higher Education Commission"].map((name, i) => ({_key: String(i), name, image: {_type: "image", alt: name + " logo", asset: {_type: "reference", _ref: "image-logo-800x600-jpg"}}}));
  // Missing assets and malformed legacy rich text are deliberate regressions.
  const services = docs.filter((doc) => doc._type === "service");
  services[0].image = {};
  services[1].image = { asset: {} };
  services[2].image = { asset: { _ref: "invalid" } };
  const image = (name, alt) => ({
    _type: "image",
    asset: { _type: "reference", _ref: `image-${name.replace(/[^a-zA-Z0-9]/g,'')}-800x600-jpg` },
    alt,
  });
  const site = docs.find((doc) => doc._type === "siteSettings");
  site.logo = image("logo", "NC4SCM logo");
  for (const doc of docs) {
    if (doc._type === "teamMember") doc.avatar = image("portrait", doc.fullName);
    if (doc._type === "partner")
      doc.logo = {...image(`partner-${doc.organizationName.toLowerCase().replaceAll(' ','-')}`, doc.organizationName), crop:{_type:'sanity.imageCrop',top:.2,bottom:.2,left:.1,right:.1}};
    if (doc._type === "news") doc.coverImage = image("news", doc.headline);
    if (doc._type === "event") doc.coverImage = image("event", doc.title);
  }
  const past = docs.find((doc) => doc._type === "event");
  past.pastEventRecap = "Local fixture recap for gallery verification.";
  past.gallery = [
    {
      ...image("event", "Event photograph"),
      _key: "gallery",
      caption: "Local fixture caption",
    },
  ];
  past.keyOutcomes = ["Fixture outcome one", "Fixture outcome two"];
  past.gallery.push({ ...image("eventtwo", "Second event photograph"), _key: "gallery-two", caption: "Second fixture caption" });
  const editorial = JSON.parse(await readFile(new URL('../seed/editorial-update.json', import.meta.url), 'utf8'));
  for (const update of editorial.updates) {
    const doc = docs.find(doc => doc._id === update.id);
    if (!doc) throw Error(`Missing editorial fixture: ${update.id}`);
    const set = await hydrateMedia(update.set, async file => `image-${file.split('/').at(-1).replace(/\.(jpg|png)$/, '').replace(/[^a-z0-9]/g,'')}-800x600-jpg`);
    for (const [path,value] of Object.entries(set)) setPath(doc,path,value);
  }
  docs.push(...await hydrateMedia(editorial.creates, async file => `image-${file.split('/').at(-1).replace(/\.(jpg|png)$/, '').replace(/[^a-z0-9]/g,'')}-800x600-jpg`));
  return docs.map((doc) => ({
    ...doc,
    _rev: "fixture-revision-1",
    _createdAt: "2026-01-01T00:00:00Z",
  }));
}
function setPath(doc, path, value, missing = false) {
  const parts = path.split(".");
  let parent = doc;
  for (const key of parts.slice(0, -1)) parent = parent[key] ||= {};
  const key = parts.at(-1);
  if (!missing || parent[key] === undefined)
    parent[key] = structuredClone(value);
}
export async function createFixture(initial) {
  const docs = structuredClone(initial || (await fixtureDocuments()));
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      const send = (data, status = 200) => {
        res.writeHead(status, { "Content-Type": "application/json" });
        // Content Lake may return object keys in a different order.
        res.end(JSON.stringify(data, (_, value) =>
          value && typeof value === "object" && !Array.isArray(value)
            ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)))
            : value,
        ));
      };
      let body = "";
      for await (const chunk of req) body += chunk;
      const data = body ? JSON.parse(body) : {};
      if (url.pathname.includes("/data/query/")) {
        const query = url.searchParams.get("query") || data.query;
        const params = { ...data.params };
        for (const [key, value] of url.searchParams)
          if (key.startsWith("$")) params[key.slice(1)] = JSON.parse(value);
        const result = await evaluate(parse(query), { dataset: docs, params });
        return send({ result: await result.get(), ms: 0, query });
      }
      if (url.pathname.includes("/data/doc/")) {
        const ids = decodeURIComponent(url.pathname.split("/").at(-1)).split(
          ",",
        );
        return send({ documents: docs.filter((doc) => ids.includes(doc._id)) });
      }
      if (url.pathname.includes("/data/mutate/")) {
        const next = structuredClone(docs);
        for (const mutation of data.mutations) {
          if (mutation.create) {
            if (next.some((doc) => doc._id === mutation.create._id))
              return send({ error: { description: "Duplicate id" } }, 409);
            next.push({ ...mutation.create, _rev: "fixture-revision-1" });
          }
          if (mutation.patch) {
            const p = mutation.patch,
              doc = next.find((doc) => doc._id === p.id);
            if (!doc || (p.ifRevisionID && p.ifRevisionID !== doc._rev))
              return send({ error: { description: "Revision conflict" } }, 409);
            for (const [path, value] of Object.entries(p.setIfMissing || {}))
              setPath(doc, path, value, true);
            for (const [path, value] of Object.entries(p.set || {}))
              setPath(doc, path, value);
            doc._rev = "fixture-revision-2";
          }
        }
        docs.splice(0, docs.length, ...next);
        return send({
          transactionId: "fixture-transaction",
          results: data.mutations.map((m) => ({
            id: m.create?._id || m.patch?.id,
          })),
        });
      }
      return send({ error: "Unknown test endpoint" }, 404);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: String(error) }));
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return {
    docs,
    host: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise((resolve) => server.close(resolve)),
    server,
  };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const fixture = await createFixture();
  console.log(fixture.host);
}
