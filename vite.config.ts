import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";

export default defineConfig({
  plugins: [
    {
      name: "mdx-search-text",
      enforce: "pre",
      transform(code, id) {
        if (id.endsWith(".mdx?metadata")) {
          const metadata = code.match(/^export const meta = [\s\S]*?\n};/);
          if (!metadata)
            this.error("MDX lesson is missing its metadata export: " + id);
          return (
            metadata[0] +
            "\nexport const searchText = " +
            JSON.stringify(code.slice(metadata[0].length)) +
            ";"
          );
        }
      },
    },
    {
      enforce: "pre",
      ...mdx({ include: /\.mdx$/, remarkPlugins: [remarkGfm] }),
    },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "lesson-index",
              test: /\.mdx\?metadata$/,
              includeDependenciesRecursively: false,
            },
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
