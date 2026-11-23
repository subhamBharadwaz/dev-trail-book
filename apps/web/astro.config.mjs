import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import path from "node:path";
export default defineConfig({
  site: "https://dev-trailbook.pages.dev",
  srcDir: "./astro",
  server: { port: 5173 },
  integrations: [
    react({ experimentalDisableStreaming: true }),
    sitemap({
      filter: (u) =>
        !/^\/(review|account|today|evidence|mistakes|interviews|readiness|backup|saved|practice)(\/|$)/.test(
          new URL(u).pathname,
        ),
    }),
  ],
  vite: {
    envDir: path.resolve(import.meta.dirname, "../.."),
    envPrefix: ["PUBLIC_", "VITE_"],
    resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
    plugins: [
      {
        name: "lesson-metadata",
        enforce: "pre",
        transform(code, id) {
          if (id.endsWith(".mdx?search")) {
            return "export const searchText = " + JSON.stringify(code) + ";";
          }
          if (id.endsWith(".mdx?metadata")) {
            const m = code.match(/^export const meta = [\s\S]*?\n};/);
            if (!m) throw new Error("Missing metadata");
            return (
              m[0] + "\nexport const searchText = " + JSON.stringify("") + ";"
            );
          }
        },
      },
      {
        enforce: "pre",
        ...mdx({ include: /\.mdx$/, remarkPlugins: [remarkGfm] }),
      },
      tailwind(),
    ],
  },
});
