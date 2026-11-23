import { publicPages } from "../src/features/platform/data/public-pages";
import { readFile, access } from "node:fs/promises";
import { topics } from "@trailbook/content/native";
const output = new URL("../dist/", import.meta.url);
const read = (path: string) => readFile(new URL(path, output), "utf8");
for (const topic of topics) {
  const html = await read(`topic/${topic.slug}/index.html`);
  for (const text of [
    "<article",
    "Before this lesson",
    "Main navigation",
    'name="description"',
    'property="og:image"',
    'rel="canonical"',
  ])
    if (!html.includes(text)) throw new Error(`${topic.slug}: missing ${text}`);
  if (!html.includes(`https://dev-trailbook.pages.dev/topic/${topic.slug}/`))
    throw new Error(`Bad canonical: ${topic.slug}`);
  if (!html.includes('client="load"') || html.includes('slot="fallback"'))
    throw new Error(`Lesson does not hydrate its real layout: ${topic.slug}`);
  if (html.includes("Loading this note…"))
    throw new Error(`Lesson body was deferred to the client: ${topic.slug}`);
  if (html.includes('content="noindex'))
    throw new Error(`Lesson excluded: ${topic.slug}`);
  if (!html.includes("data-code-block"))
    throw new Error(`Missing worked code: ${topic.slug}`);
}
for (const route of [
  "review",
  "account",
  "today",
  "evidence",
  "mistakes",
  "interviews",
  "readiness",
  "backup",
  "saved",
  "practice",
]) {
  if (!(await read(`${route}/index.html`)).includes("noindex, follow"))
    throw new Error(`Workspace indexable: ${route}`);
}
for (const route of Object.keys(publicPages)) {
  const html = await read(`${route}/index.html`);
  if (!html.includes("<h1") || html.includes('content="noindex'))
    throw new Error(`Public page not readable/indexable: ${route}`);
  if (!html.includes(`https://dev-trailbook.pages.dev/${route}/`))
    throw new Error(`Public page canonical missing: ${route}`);
}
const home = await read("index.html");
if (!home.includes('name="google-site-verification"'))
  throw new Error("Google verification tag missing");
if (!home.includes("Find your starting point"))
  throw new Error("First-visit guide missing");
const sitemap = await read("sitemap-0.xml");
for (const route of Object.keys(publicPages))
  if (!sitemap.includes(`/${route}/`))
    throw new Error(`Public page missing from sitemap: ${route}`);
for (const topic of topics)
  if (!sitemap.includes(`/topic/${topic.slug}/`))
    throw new Error(`Missing lesson in sitemap: ${topic.slug}`);
if (
  /https:\/\/dev-trailbook.pages.dev\/(review|account|today|evidence|mistakes|interviews|readiness|backup|saved|practice)(\/|<)/.test(
    sitemap,
  )
)
  throw new Error("Workspace leaked into sitemap");
for (const path of [
  "og-image.jpg",
  "robots.txt",
  "404.html",
  "sitemap-index.xml",
])
  await access(new URL(path, output));
console.log(
  `SEO output verified: ${topics.length} readable lesson pages, canonical metadata, public sitemap, workspace noindex and share assets.`,
);
