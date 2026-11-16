import { readdir, readFile, writeFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
const source = new URL("../lessons/", import.meta.url);
const parser = unified().use(remarkParse).use(remarkGfm);
import { createHighlighter } from "shiki";
const highlighter = await createHighlighter({
  themes: ["github-dark"],
  langs: [
    "javascript",
    "typescript",
    "tsx",
    "jsx",
    "html",
    "css",
    "json",
    "bash",
    "sql",
  ],
});
async function highlight(node: Record<string, unknown>) {
  if (node.type === "code" && typeof node.value === "string") {
    const requested = String(node.lang || "text").split(/\s/)[0];
    const lang = highlighter.getLoadedLanguages().includes(requested)
      ? requested
      : "text";
    node.tokens = highlighter
      .codeToTokens(node.value, { lang, theme: "github-dark" })
      .tokens.map((line) =>
        line.map(({ content, color }) => ({ content, color })),
      );
  }
  if (Array.isArray(node.children))
    for (const child of node.children) await highlight(child);
}
const slugs = new Set<string>();
const topics = await Promise.all(
  (await readdir(source))
    .filter((f) => f.endsWith(".mdx"))
    .sort()
    .map(async (file) => {
      const text = await readFile(new URL(file, source), "utf8");
      const match = text.match(/^export const meta = ([\s\S]*?\n});/);
      if (!match) throw new Error(`Missing metadata: ${file}`);
      // Only trusted, repository-owned metadata is evaluated at build time; never user input.
      const meta = runInNewContext(`(${match[1]})`, Object.create(null), {
        timeout: 1000,
      });
      if (!meta.slug || slugs.has(meta.slug))
        throw new Error(`Invalid or duplicate slug: ${file}`);
      slugs.add(meta.slug);
      const markdown = text.slice(match[0].length).trim();
      const body = JSON.parse(
        JSON.stringify(parser.parse(markdown), (key, value) =>
          key === "position" ? undefined : value,
        ),
      );
      await highlight(body);
      return {
        ...meta,
        body,
        searchText: (JSON.stringify(meta) + " " + markdown).toLowerCase(),
      };
    }),
);
await writeFile(
  new URL("../src/topics.json", import.meta.url),
  JSON.stringify(topics),
);
highlighter.dispose();
console.log(
  `Generated ${topics.length} offline lessons from shared MDX sources.`,
);
