import {readFile, writeFile} from "node:fs/promises"
import {dirname, resolve} from "node:path"
import {fileURLToPath, pathToFileURL} from "node:url"

const seedDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(seedDir, "../..")
const source = resolve(seedDir, "client-content.ndjson")
const output = resolve(seedDir, "client-content.generated.ndjson")

const images = {
  siteSettings: ["logo", "frontend-ui/public/media/brand/nc4scm-logo.webp", "NC4SCM logo"],
  "partner-power-cement": ["logo", "frontend-ui/public/media/partners/power-cement.png", "Power Cement logo"],
  "partner-cherat-cement": ["logo", "frontend-ui/public/media/partners/cherat-cement.jpeg", "Cherat Cement logo"],
  "partner-bestway-cement": ["logo", "frontend-ui/public/media/partners/bestway-cement.jpeg", "Bestway Cement logo"],
  "news-iep-fellowship-2026": ["coverImage", "frontend-ui/public/media/news/iep-fellowship-gcgc-impact.jpg", "Dr Tariq Jamil receiving IEP Fellowship recognition"],
  "news-gcgc-structural-demonstration-2025": ["coverImage", "frontend-ui/public/media/news/gcgc-2025-structural-demo.jpg", "GCGC 2025 and LC3 structural demonstration"],
  "news-lc3-at-hvacr-trends-2025": ["coverImage", "frontend-ui/public/media/news/hvacr-trends-2025.jpg", "LC3 presentation at HVACR Trends"],
  "news-epfl-workshop-2025": ["coverImage", "frontend-ui/public/media/news/epfl-lc3-workshop-2025.jpg", "LC3 workshop at EPFL"],
  "news-icec-2024": ["coverImage", "frontend-ui/public/media/news/icec-2024.jpg", "LC3 presentation at ICEC 2024"],
  "news-spar6c-2024": ["coverImage", "frontend-ui/public/media/news/spar6c-2024.jpg", "SPAR6C cement decarbonisation workshop"],
  "news-shec-showcase-2022": ["coverImage", "frontend-ui/public/media/news/shec-showcase-2022.jpg", "LC3 at Sindh HEC showcase"],
  "event-lc3-seminar-architects-2026": ["coverImage", "frontend-ui/public/media/news/lc3-seminar-architects-2026.webp", "LC3 seminar for architects poster"],
  "event-gcgc-2025": ["coverImage", "frontend-ui/public/media/news/gcgc-2025-structural-demo.jpg", "GCGC 2025 event"],
  "event-national-workshop-lc3-2023": ["coverImage", "frontend-ui/public/media/news/national-workshop-2023.jpg", "National Workshop on LC3"],
}

const lines = (await readFile(source, "utf8")).trim().split(/\r?\n/)
const documents = lines.map((line) => {
  const document = JSON.parse(line)
  const asset = images[document._id]
  if (asset) {
    const [field, relativePath, alt] = asset
    document[field] = {_type: "image", _sanityAsset: `image@${pathToFileURL(resolve(repoRoot, relativePath)).href}`, alt}
  }
  return JSON.stringify(document)
})

await writeFile(output, `${documents.join("\n")}\n`)
console.log(`Prepared ${documents.length} editable Sanity documents at ${output}`)
