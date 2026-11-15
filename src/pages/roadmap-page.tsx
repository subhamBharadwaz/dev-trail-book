import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@ui-sdk/react/accordion";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Map,
  MessageSquare,
} from "lucide-react";
import { studyWeeks } from "@/features/roadmap/data/study-plan";
import { topicBySlug, topics } from "@/features/topics/data/content";
import { useReadingState } from "@/hooks/use-reading-state";
import { ProgressMeter } from "@/components/ui/progress-meter";
const recaps = [
  "closures",
  "debounce-throttle",
  "search-abort-races",
  "redirect-errors",
  "server-data-fetching",
];
export function RoadmapPage() {
  const { read } = useReadingState();
  const covered = topics.filter(
    (topic) => topic.planRecordedStatus === "covered",
  );
  const pending = topics.filter(
    (topic) => topic.planRecordedStatus === "pending",
  );
  return (
    <div className="mx-auto max-w-5xl px-6 py-10 md:px-12">
      <p className="text-sm font-medium uppercase tracking-[.15em] text-green">
        THE PLAN, CONNECTED TO YOUR NOTES
      </p>
      <h1 className="mt-4 text-4xl font-medium tracking-tight">
        Your study roadmap.
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-ink">
        The confirmed December 2026 plan, organized into lessons, questions,
        examples, and practice. The dates below are the original schedule; they
        do not mark anything complete automatically.
      </p>
      <div className="mt-7 flex flex-wrap gap-5 border-y border-line py-4 text-sm text-muted-ink">
        <span>{topics.length} topic notes</span>
        <span>{studyWeeks.length} stages</span>
        <span>
          {topics.filter((topic) => read.includes(topic.slug)).length} marked as
          read
        </span>
        <span>Source: December 2026 job plan · 6 pages</span>
      </div>
      <a
        href="#/topic/pdf-coverage-checklist"
        className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-line bg-green-soft p-5 text-sm font-medium text-green"
      >
        <span>PDF coverage audit &amp; interview-readiness checklist</span>
        <ArrowRight size={16} aria-hidden="true" />
      </a>
      <section className="mt-8 rounded-xl border border-line bg-surface p-5">
        <div className="flex items-center gap-2 text-green">
          <MessageSquare size={17} />
          <h2 className="text-sm font-medium">
            From the discussions we could retrieve
          </h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-ink">
          These recaps use the available closure, user-search, and
          interview-prep excerpts. Older unseen chat turns are not presented as
          recovered transcripts. Other lessons expand the PDF syllabus or the
          site’s existing foundations.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {recaps.map((slug) => {
            const topic = topicBySlug.get(slug)!;
            return (
              <a
                key={slug}
                href={`#/topic/${slug}`}
                className="rounded-lg border border-line bg-page px-3 py-2 text-sm text-green hover:border-green"
              >
                {topic.title}
              </a>
            );
          })}
        </div>
      </section>
      <div className="my-6 grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-line p-5">
          <h2 className="text-sm font-medium">Carry forward prior study</h2>
          <p className="mt-2 text-sm leading-6 text-muted-ink">
            PDF page 1 records these as covered. Start with recall and review
            gaps; do not restart automatically.
          </p>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
            {covered.map((topic) => (
              <a
                className="text-sm text-green underline-offset-2 hover:underline"
                href={`#/topic/${topic.slug}`}
                key={topic.slug}
              >
                {topic.title}
              </a>
            ))}
          </div>
        </section>
        <section className="rounded-xl border border-line p-5">
          <h2 className="text-sm font-medium">The recorded resume point</h2>
          <p className="mt-2 text-sm leading-6 text-muted-ink">
            Week 1, Day 4 topics: this, prototypes/classes, and stale closures,
            after a brief recall check. The plan records the following DSA work
            as pending.
          </p>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
            {pending.map((topic) => (
              <a
                className="text-sm text-green hover:underline"
                href={`#/topic/${topic.slug}`}
                key={topic.slug}
              >
                {topic.title}
              </a>
            ))}
          </div>
        </section>
      </div>
      <Accordion
        aria-label="Study roadmap weeks"
        defaultValue={["plan-week-1"]}
        className="space-y-3"
      >
        {studyWeeks.map((week) => {
          const list = week.slugs.flatMap((slug) => {
            const topic = topicBySlug.get(slug);
            return topic ? [topic] : [];
          });
          const done = list.filter((topic) => read.includes(topic.slug)).length;
          return (
            <AccordionItem
              key={week.id}
              value={week.id}
              className="overflow-hidden rounded-xl border border-line"
            >
              <AccordionHeader>
                <AccordionTrigger className="group flex w-full items-center gap-4 bg-page px-5 py-5 text-left">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green-soft font-mono text-sm text-green">
                    {week.number === 10 ? "END" : `W${week.number}`}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium">
                      {week.title}
                    </span>
                    <span className="mt-1 block text-sm font-normal text-muted-ink">
                      {week.dates} · PDF page {week.page} · {done}/{list.length}{" "}
                      read
                    </span>
                  </span>
                  <ChevronDown
                    size={16}
                    className="shrink-0 text-muted-ink group-data-open:rotate-180"
                  />
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionPanel className="border-t border-line px-5 pb-6 pt-5">
                <ProgressMeter
                  value={done}
                  max={list.length}
                  label={`${week.title} reading progress`}
                />
                <p className="mt-4 text-sm leading-7 text-muted-ink">
                  {week.description}
                </p>
                <ul className="mt-4 space-y-2">
                  {week.tasks.map((task) => (
                    <li
                      key={task}
                      className="flex gap-2 text-sm leading-6 text-muted-ink"
                    >
                      <span className="text-green">·</span>
                      {task}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {list.map((topic) => (
                    <a
                      key={topic.slug}
                      href={`#/topic/${topic.slug}`}
                      className="flex items-center gap-2 rounded-lg border border-line px-3 py-3 text-sm hover:border-green"
                    >
                      {read.includes(topic.slug) ? (
                        <Check size={13} className="shrink-0 text-green" />
                      ) : (
                        <BookOpen
                          size={13}
                          className="shrink-0 text-muted-ink"
                        />
                      )}
                      <span>{topic.title}</span>
                    </a>
                  ))}
                </div>
                <div className="mt-5 rounded-lg bg-green-soft p-4 text-sm leading-6">
                  <strong className="font-medium text-green">
                    Evidence gate
                  </strong>
                  <p className="mt-1">{week.gate}</p>
                </div>
                <div className="mt-5 flex flex-wrap gap-5">
                  <a
                    href={`#/paths/${week.id}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-green"
                  >
                    Follow this stage
                    <ArrowRight size={13} />
                  </a>
                  <a
                    href={`#/practice/path/${week.id}`}
                    className="text-sm font-medium text-green"
                  >
                    Practice these topics →
                  </a>
                </div>
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>
      <section className="mt-8 rounded-xl border border-line p-5">
        <h2 className="flex items-center gap-2 text-sm font-medium">
          <Map size={16} />
          Keep the plan sustainable
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted-ink">
          Use the{" "}
          <a
            href="#/topic/daily-learning-loop"
            className="text-green underline"
          >
            daily loop and fallbacks
          </a>
          , the{" "}
          <a
            href="#/topic/application-scorecard"
            className="text-green underline"
          >
            weekly scorecard
          </a>
          , and delayed DSA re-solves. No new capstone, broad framework hopping,
          ML mathematics, fine-tuning, Kubernetes, or deep DevOps. Optional
          heaps and retrieval remain optional. Apply alongside study; the target
          date is not a guaranteed offer.
        </p>
      </section>
    </div>
  );
}
