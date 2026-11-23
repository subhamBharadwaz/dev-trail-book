import { useHydrated } from "@/hooks/use-hydrated";
import { useAccount } from "@/features/account/hooks/use-account";
import { TopicStudyContext } from "./topic-study-context";
import { TopicWorkshop } from "./topic-workshop";
import { TopicConfidence } from "./topic-confidence";
import { topicBySlug } from "../data/content";
import { Prose } from "@/components/content/prose";
import { lazy, Suspense, useState, type ReactNode } from "react";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs";
import { Toggle } from "@ui-sdk/react/toggle";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  Clock3,
  ExternalLink,
  Lightbulb,
} from "lucide-react";
import { CodeBlock } from "@/components/content/code-block";
import { Questions } from "./topic-questions";
import { Facts } from "./topic-facts";
import { categories, type Topic } from "../data/content";
const TopicVisual = lazy(() =>
  import("@/features/explainers/topic-visual").then((module) => ({
    default: module.TopicVisual,
  })),
);

const tabClassName =
  "flex items-center gap-1.5 whitespace-nowrap border-b-2 border-transparent bg-transparent py-[13px] text-sm text-muted-ink aria-selected:border-green aria-selected:font-medium aria-selected:text-green";

const components = {
  pre: CodeBlock,
  h2: ({ children }: { children?: ReactNode }) => (
    <h2
      id={String(children)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}
    >
      {children}
    </h2>
  ),
};
export function TopicReader({
  topic,
  saved,
  completed,
  toggleSaved,
  toggleCompleted,
}: {
  topic: Topic;
  saved: boolean;
  completed: boolean;
  toggleSaved: () => void;
  toggleCompleted: () => void;
}) {
  const hydrated = useHydrated();
  const { loading: accountLoading } = useAccount();
  const [section, setSection] = useState<string | null>("notes");
  const category = categories.find((item) => item.id === topic.category)!;
  const next = topic.study?.next
    ? topicBySlug.get(topic.study.next)
    : undefined;
  return (
    <div className="mx-auto grid max-w-[830px] grid-cols-[minmax(0,1fr)] gap-[46px] px-[23px] pb-[50px] pt-[27px] sm:px-8 min-[701px]:py-[35px] @min-[1120px]:max-w-[1100px] @min-[1120px]:grid-cols-[minmax(0,740px)_155px] lg:px-10 min-[1201px]:pb-[70px] min-[1201px]:pt-[39px]">
      <article className="min-w-0 [&>h1]:mb-[15px] [&>h1]:mt-[18px] [&>h1]:text-balance [&>h1]:text-[33px] [&>h1]:font-medium [&>h1]:leading-[1.17] [&>h1]:tracking-[-1.3px] min-[701px]:[&>h1]:text-[37px]">
        <a
          className="mb-[30px] inline-flex items-center gap-2 text-sm text-muted-ink hover:text-green"
          href={`/category/${category.id}`}
        >
          <ArrowLeft size={14} />
          Back to {category.name}
        </a>
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium tracking-[1.1px] text-green">
          <span
            className={`grid size-[22px] shrink-0 place-items-center rounded text-sm font-semibold ${category.color}`}
          >
            {category.symbol}
          </span>
          {category.name}
          <span className="text-muted-ink">·</span>
          {topic.level}
        </div>
        <h1>{topic.title}</h1>
        <p className="text-[15px] leading-[1.8] text-muted-ink">
          {topic.description}
        </p>
        <div className="mb-[30px] mt-[22px] flex flex-wrap items-center gap-2.5 text-sm text-muted-ink min-[701px]:gap-[17px] min-[701px]:text-sm [&>span]:flex [&>span]:whitespace-nowrap [&>span]:items-center [&>span]:gap-[5px]">
          <span>
            <Clock3 size={14} />
            {topic.minutes} min read
          </span>
          <span>Self-paced lesson</span>
          <Toggle
            className="ml-auto flex min-h-11 items-center gap-[7px] whitespace-nowrap rounded border border-line bg-page px-2.5 py-[7px] text-sm text-muted-ink min-[701px]:text-sm data-pressed:border-green data-pressed:bg-green-soft data-pressed:text-green"
            aria-label="Save this topic"
            pressed={saved}
            disabled={accountLoading}
            onPressedChange={toggleSaved}
          >
            <Bookmark size={15} aria-hidden="true" />
            Save topic
          </Toggle>
        </div>
        <TopicStudyContext topic={topic} />
        <Tabs key={topic.slug} value={section} onValueChange={setSection}>
          <TabsList
            aria-label="Topic sections"
            className="mb-[30px] flex gap-[17px] overflow-x-auto border-b border-line min-[701px]:gap-[21px]"
          >
            <TabsTab className={tabClassName} value="notes">
              Overview
            </TabsTab>
            <TabsTab className={tabClassName} value="code">
              Code example
            </TabsTab>
            <TabsTab className={tabClassName} value="questions">
              Q&A{" "}
              <span className="rounded bg-surface-hover px-[5px] py-0.5 text-[8px]">
                {topic.questions.length}
              </span>
            </TabsTab>
            <TabsTab className={tabClassName} value="facts">
              Must know
            </TabsTab>
          </TabsList>
          <TabsPanel value="notes">
            <Suspense fallback={<p role="status">Loading the visual guide…</p>}>
              {hydrated && <TopicVisual key={topic.slug} slug={topic.slug} />}
            </Suspense>
            <Prose>
              <Suspense fallback={<p role="status">Loading this note…</p>}>
                <topic.Content components={components} />
              </Suspense>
            </Prose>
            <TopicWorkshop key={topic.slug} topic={topic} />
            <div className="my-[26px] flex items-start gap-3 rounded-md border border-line bg-green-soft p-[18px] text-sm leading-[1.8] text-green [&_strong]:text-sm [&_strong]:font-medium [&_p]:mt-[3px] [&_p]:text-sm [&_p]:text-ink [&>svg]:mt-0.5">
              <Lightbulb size={19} />
              <div>
                <strong>The takeaway</strong>
                <p>{topic.facts[0]}</p>
              </div>
            </div>
          </TabsPanel>
          <TabsPanel value="code">
            <div className="[&_h2]:mb-[13px] [&_h2]:text-xl [&_h2]:font-medium [&_h2]:tracking-[-.55px] [&_p]:mb-[23px] [&_p]:text-sm [&_p]:leading-[1.8] [&_p]:text-muted-ink">
              <h2>Learn by reading the code</h2>
              <p>
                Trace the inputs, the state, and the result. Then make it your
                own.
              </p>
            </div>
            <CodeBlock
              code={topic.code}
              language={topic.codeLanguage || "tsx"}
            />
            <div className="my-[26px] flex items-start gap-3 rounded-md border border-line bg-green-soft p-[18px] text-sm leading-[1.8] text-green [&_strong]:text-sm [&_strong]:font-medium [&_p]:mt-[3px] [&_p]:text-sm [&_p]:text-ink [&>svg]:mt-0.5">
              <Lightbulb size={19} />
              <p>
                These snippets are reading examples. Try them in your own
                project; this page does not execute them.
              </p>
            </div>
          </TabsPanel>
          <TabsPanel value="questions">
            <div className="[&_h2]:mb-[13px] [&_h2]:text-xl [&_h2]:font-medium [&_h2]:tracking-[-.55px] [&_p]:mb-[23px] [&_p]:text-sm [&_p]:leading-[1.8] [&_p]:text-muted-ink">
              <h2>Questions worth asking</h2>
              <p>
                Pause before opening an answer. Can you explain it in your own
                words?
              </p>
            </div>
            <Questions topic={topic} />
          </TabsPanel>
          <TabsPanel value="facts">
            <div className="[&_h2]:mb-[13px] [&_h2]:text-xl [&_h2]:font-medium [&_h2]:tracking-[-.55px] [&_p]:mb-[23px] [&_p]:text-sm [&_p]:leading-[1.8] [&_p]:text-muted-ink">
              <h2>A few things to remember</h2>
              <p>The details that are easy to miss and useful to keep.</p>
            </div>
            <Facts topic={topic} />
          </TabsPanel>
        </Tabs>
        <TopicConfidence slug={topic.slug} />
        <div className="mt-[35px] flex flex-wrap items-start justify-between gap-[15px] border-y border-line py-[25px] min-[701px]:items-center [&_strong]:text-sm [&_strong]:font-medium [&_p]:mt-[7px] [&_p]:text-sm [&_p]:leading-[1.7] [&_p]:text-muted-ink">
          <div>
            <strong>
              {completed
                ? "One more concept, connected."
                : "Make this one stick."}
            </strong>
            <p>
              {completed
                ? "You marked this topic as read."
                : "Mark it as read after reading. Use the separate confidence rating to track what you can explain or implement."}
            </p>
          </div>
          <Toggle
            className="flex items-center gap-[7px] whitespace-nowrap rounded border border-line bg-page px-[11px] py-[9px] text-sm text-ink data-pressed:border-green data-pressed:bg-green-soft data-pressed:text-green"
            aria-label="Mark as read"
            pressed={completed}
            disabled={accountLoading}
            onPressedChange={toggleCompleted}
          >
            <Check size={15} aria-hidden="true" />
            {completed ? "Read" : "Mark as read"}
          </Toggle>
        </div>
        {next && next.slug !== topic.slug && (
          <a
            className="flex items-center justify-between py-[25px] text-green [&_span]:mb-2 [&_span]:block [&_span]:text-sm [&_span]:tracking-[1px] [&_span]:text-muted-ink [&_strong]:text-sm [&_strong]:font-medium"
            href={`/topic/${next.slug}`}
          >
            <div>
              <span>
                {topic.study?.next
                  ? "SUGGESTED NEXT LESSON"
                  : `UP NEXT IN ${category.name.toUpperCase()}`}
              </span>
              <strong>{next.title}</strong>
            </div>
            <ArrowRight size={18} />
          </a>
        )}
      </article>
      <aside className="sticky top-5 hidden self-start pt-[87px] @min-[1120px]:block">
        <span className="text-sm font-medium tracking-[1.1px] text-muted-ink">
          IN THIS NOTE
        </span>
        {[
          "The idea",
          "Why it matters",
          "A practical example",
          "Try it yourself",
          "Make it stick",
          "Confidence",
          "Keep exploring",
        ].map((text) => (
          <a
            key={text}
            className="my-[13px] block text-sm leading-relaxed text-muted-ink hover:text-green"
            href={`/topic/${topic.slug}`}
            onClick={(event) => {
              event.preventDefault();
              setSection("notes");
              requestAnimationFrame(() =>
                document
                  .getElementById(
                    text.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                  )
                  ?.scrollIntoView({ behavior: "instant" }),
              );
            }}
          >
            {text}
          </a>
        ))}
        <div className="my-[26px] h-px bg-line" />
        <span className="text-sm font-medium tracking-[1.1px] text-muted-ink">
          FILE UNDER
        </span>
        <div className="flex flex-wrap gap-1.5 [&>span]:rounded [&>span]:border [&>span]:border-line [&>span]:px-1.5 [&>span]:py-1 [&>span]:text-[8px] [&>span]:text-muted-ink">
          {topic.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <a
          className="mt-[29px] flex items-center gap-1.5 text-sm text-green"
          href={topic.source}
          target="_blank"
          rel="noreferrer"
        >
          Official documentation
          <ExternalLink size={12} />
        </a>
      </aside>
    </div>
  );
}
