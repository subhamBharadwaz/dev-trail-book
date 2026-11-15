import {
  Children,
  isValidElement,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { ThemedToken } from "shiki";
import { Check, Copy, Terminal } from "lucide-react";
import { Button } from "../ui/button";
export function CodeBlock({
  children,
  code,
  language: explicitLanguage,
}: {
  children?: ReactNode;
  code?: string;
  language?: string;
}) {
  const [status, setStatus] = useState("");
  const [highlighted, setHighlighted] = useState<{
    text: string;
    language: string;
    tokens: ThemedToken[][];
  } | null>(null);
  const child = Children.toArray(children)[0];
  const props = isValidElement<{ children?: ReactNode; className?: string }>(
    child,
  )
    ? child.props
    : undefined;
  const text = (code ?? String(props?.children ?? children ?? "")).replace(
    /\n$/,
    "",
  );
  const language =
    explicitLanguage || props?.className?.replace("language-", "") || "text";
  useEffect(() => {
    let active = true;
    import("./syntax-highlighter")
      .then((module) => module.highlightCode(text, language))
      .then((tokens) => {
        if (active) setHighlighted({ text, language, tokens });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [text, language]);
  const tokens =
    highlighted?.text === text && highlighted.language === language
      ? highlighted.tokens
      : undefined;
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied");
    } catch {
      setStatus("Copy unavailable");
    }
  }
  return (
    <div
      data-code-block
      className="my-6 overflow-hidden rounded-xl border border-[#30363d] bg-[#0d1117] text-[#c9d1d9] shadow-sm"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#30363d] bg-[#161b22] px-4 py-2.5">
        <div className="flex items-center gap-2 text-sm text-[#aeb9c6]">
          <Terminal size={14} aria-hidden="true" />
          <span>{language}</span>
          <span className="hidden border-l border-[#30363d] pl-2 text-sm text-[#aeb9c6] sm:inline">
            GitHub Dark
          </span>
        </div>
        <Button
          variant="ghost"
          size="xs"
          aria-label={`Copy ${language} example`}
          onClick={copy}
          className="gap-1.5 text-sm text-[#c9d1d9] hover:bg-[#30363d] hover:text-white focus-visible:outline-[#79c0ff]"
        >
          {status === "Copied" ? <Check size={12} /> : <Copy size={12} />}
          <span>{status || "Copy"}</span>
        </Button>
      </div>
      <pre
        className="m-0 overflow-x-auto py-5 pr-5 font-mono text-sm leading-[1.9] sm:text-[15px]"
        tabIndex={0}
        aria-label={`${language} code example`}
      >
        <code>
          {text.split("\n").map((line, index) => (
            <span key={index}>
              <span
                aria-hidden="true"
                className="inline-block w-11 select-none pr-4 text-right text-[#8b949e]"
              >
                {index + 1}
              </span>
              <span>
                {tokens?.[index]
                  ? tokens[index].map((token, position) => (
                      <span key={position} style={{ color: token.color }}>
                        {token.content}
                      </span>
                    ))
                  : line || " "}
              </span>
              {"\n"}
            </span>
          ))}
        </code>
      </pre>
      <span className="sr-only" role="status">
        {status}
      </span>
    </div>
  );
}
