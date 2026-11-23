import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";
export default mergeConfig(
  viteConfig,
  defineConfig({
    resolve: {
      alias: {
        "astro:transitions/client": new URL(
          "./src/test/astro-navigation.ts",
          import.meta.url,
        ).pathname,
      },
    },
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(""),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(""),
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      css: false,
    },
  }),
);
