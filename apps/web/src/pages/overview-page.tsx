import {
  ArrowRight,
  BookOpen,
  CircleHelp,
  FolderOpen,
  Layers3,
  Mic2,
  NotebookPen,
  Route,
  type LucideIcon,
} from "lucide-react";
import { categories, topics } from "@/features/topics/data/content";
import { TopicRow } from "@/features/topics/components/topic-row";
import { CategoryCard } from "@/features/topics/components/category-card";
import { useReadingState } from "@/hooks/use-reading-state";
import { StudyHero } from "@/features/overview/components/study-hero";
const shortcuts: {
  href: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  number: string;
}[] = [
  {
    href: "#/practice",
    title: "Test your recall",
    description: "Put the notes away. Find out what actually stuck.",
    Icon: Layers3,
    number: "01",
  },
  {
    href: "#/interviews",
    title: "Say it out loud",
    description: "Practice explaining your thinking under a time limit.",
    Icon: Mic2,
    number: "02",
  },
  {
    href: "#/mistakes",
    title: "Turn a miss into progress",
    description: "Revisit the mistakes that deserve another attempt.",
    Icon: NotebookPen,
    number: "03",
  },
];
export function OverviewPage() {
  const { read } = useReadingState();
  const readCount = topics.filter((topic) => read.includes(topic.slug)).length;
  const foundation = topics.find(
    (topic) => topic.slug === "thinking-in-react",
  )!;
  const suggested = [
    "thinking-in-react",
    "closures",
    "discriminated-unions",
    "zod-runtime-contracts",
  ].map((slug) => topics.find((topic) => topic.slug === slug)!);
  const next =
    suggested.find((topic) => !read.includes(topic.slug)) ??
    topics.find((topic) => !read.includes(topic.slug)) ??
    foundation;
  const questionCount = topics.reduce(
    (sum, topic) => sum + topic.questions.length,
    0,
  );
  return (
    <div className="mx-auto max-w-[1210px] px-5 pb-4 pt-8 sm:px-8 sm:pt-10 lg:px-10 @min-[1050px]:pt-12">
      <StudyHero topic={next} readCount={readCount} total={topics.length} />
      <dl className="grid grid-cols-3 gap-3 border-b border-line py-6 sm:gap-6 sm:py-7">
        {[
          {
            value: topics.length,
            label: "Topics to understand",
            Icon: BookOpen,
          },
          {
            value: questionCount,
            label: "Questions to work through",
            Icon: CircleHelp,
          },
          {
            value: categories.length,
            label: "Connected categories",
            Icon: FolderOpen,
          },
        ].map(({ value, label, Icon }) => (
          <div key={label} className="min-w-0">
            <dt className="flex items-center gap-2 text-sm leading-6 text-muted-ink">
              <Icon
                size={15}
                aria-hidden="true"
                className="hidden shrink-0 sm:block"
              />
              {label}
            </dt>
            <dd className="mt-2 text-2xl font-medium tracking-tight text-ink tabular-nums sm:text-3xl">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <section aria-labelledby="practice-heading" className="py-9 sm:py-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-green">LESS SCROLLING. MORE DOING.</p>
            <h2
              id="practice-heading"
              className="mt-2 text-2xl font-medium tracking-tight"
            >
              Make this session count
            </h2>
          </div>
          <a
            href="#/readiness"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-green hover:underline"
          >
            Check your readiness
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
        <div className="grid gap-3 @min-[650px]:grid-cols-3">
          {shortcuts.map(({ href, title, description, Icon, number }) => (
            <a
              key={href}
              href={href}
              className="group flex min-w-0 flex-col rounded-xl border border-line p-5 hover:border-green hover:bg-surface focus-visible:outline-2 focus-visible:outline-green"
            >
              <div className="flex items-center justify-between">
                <Icon size={21} aria-hidden="true" className="text-green" />
                <span
                  aria-hidden="true"
                  className="font-mono text-sm text-muted-ink"
                >
                  {number}
                </span>
              </div>
              <h3 className="mt-5 text-base font-medium leading-6">{title}</h3>
              <p className="mb-5 mt-2 flex-1 text-sm leading-7 text-muted-ink">
                {description}
              </p>
              <ArrowRight size={17} aria-hidden="true" className="text-green" />
            </a>
          ))}
        </div>
      </section>
      <section
        aria-label="Guided learning"
        className="mb-10 grid gap-4 rounded-xl border border-line bg-green-soft p-5 @min-[650px]:grid-cols-[auto_minmax(0,1fr)_auto] @min-[650px]:items-center sm:p-6"
      >
        <span className="grid size-11 place-items-center rounded-lg border border-line bg-page text-green">
          <Route size={21} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-medium tracking-tight">
            You don’t have to figure out the order.
          </h2>
          <p className="mt-2 text-sm leading-7 text-muted-ink">
            Follow a learning path from the fundamentals to advanced TypeScript,
            React, and real application decisions.
          </p>
        </div>
        <a
          href="#/paths"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-green hover:underline"
        >
          Find your path
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      </section>
      <section aria-labelledby="collection-heading">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-green">THE KNOWLEDGE LIBRARY</p>
            <h2
              id="collection-heading"
              className="mt-2 text-2xl font-medium tracking-tight"
            >
              Choose what to work on
            </h2>
          </div>
          <a
            href="#/topics"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-green hover:underline"
          >
            View all topics
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 @min-[430px]:grid-cols-2 @min-[860px]:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
      <section
        aria-labelledby="foundations-heading"
        className="mt-10 border-t border-line pt-8"
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2
            id="foundations-heading"
            className="text-xl font-medium tracking-tight"
          >
            A few foundations worth revisiting
          </h2>
          <span className="text-sm text-muted-ink">
            Understand the why. Then try the how.
          </span>
        </div>
        {["closures", "effects", "discriminated-unions"].map((slug) => (
          <TopicRow
            key={slug}
            topic={topics.find((topic) => topic.slug === slug)!}
            completed={read.includes(slug)}
          />
        ))}
      </section>
      <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line py-6 text-sm leading-7 text-muted-ink">
        <p>Your pace. Your progress. Your trailbook.</p>
        <a
          href="#/today"
          className="inline-flex min-h-11 items-center gap-2 text-green hover:underline"
        >
          Make time for one good session
          <ArrowRight size={14} aria-hidden="true" />
        </a>
      </footer>
    </div>
  );
}
