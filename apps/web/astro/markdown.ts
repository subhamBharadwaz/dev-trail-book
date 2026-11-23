import type { MarkdownNode } from "@trailbook/content/types";
export const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export function markdown(n: MarkdownNode): string {
  const body = () => n.children?.map(markdown).join("") || "";
  if (n.type === "text") return escape(n.value || "");
  if (n.type === "code")
    return `<pre><code>${escape(n.value || "")}</code></pre>`;
  if (n.type === "inlineCode") return `<code>${escape(n.value || "")}</code>`;
  if (n.type === "break") return "<br>";
  if (n.type === "link") {
    const u = (n.url || "").replace(/^#\//, "/");
    return /^(https?:\/\/|\/|#|mailto:)/.test(u)
      ? `<a href="${escape(u)}">${body()}</a>`
      : body();
  }
  const tag =
    n.type === "heading"
      ? `h${Math.min(6, Math.max(1, n.depth || 2))}`
      : (
          {
            paragraph: "p",
            strong: "strong",
            emphasis: "em",
            delete: "del",
            blockquote: "blockquote",
            listItem: "li",
            table: "table",
            tableRow: "tr",
            tableCell: "td",
            list: n.ordered ? "ol" : "ul",
          } as Record<string, string>
        )[n.type];
  return tag ? `<${tag}>${body()}</${tag}>` : body();
}
