import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import githubDark from "shiki/themes/github-dark.mjs";
const grammars = {
  sql: () => import("shiki/langs/sql.mjs"),
  javascript: () => import("shiki/langs/javascript.mjs"),
  typescript: () => import("shiki/langs/typescript.mjs"),
  tsx: () => import("shiki/langs/tsx.mjs"),
  css: () => import("shiki/langs/css.mjs"),
  bash: () => import("shiki/langs/bash.mjs"),
  json: () => import("shiki/langs/json.mjs"),
};
let highlighter: ReturnType<typeof createHighlighterCore> | undefined;
export async function highlightCode(code: string, language: string) {
  highlighter ??= createHighlighterCore({
    engine: createJavaScriptRegexEngine(),
    themes: [githubDark],
    langs: [],
  });
  const instance = await highlighter;
  const aliases: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    jsx: "tsx",
    sh: "bash",
    shell: "bash",
    example: "tsx",
  };
  const requested = aliases[language] || language;
  const lang = Object.hasOwn(grammars, requested)
    ? (requested as keyof typeof grammars)
    : "text";
  if (lang !== "text" && !instance.getLoadedLanguages().includes(lang))
    await instance.loadLanguage((await grammars[lang]()).default);
  return instance.codeToTokens(code, { lang, theme: "github-dark" }).tokens;
}
