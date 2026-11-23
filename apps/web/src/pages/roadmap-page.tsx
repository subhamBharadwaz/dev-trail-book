import { ArrowRight, BookOpen, Check } from "lucide-react";
import { studyWeeks } from "@/features/roadmap/data/study-plan";
import { topicBySlug } from "@/features/topics/data/content";
import { useReadingState } from "@/hooks/use-reading-state";
import { ProgressMeter } from "@/components/ui/progress-meter";
export function RoadmapPage() {
  const { read } = useReadingState();
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-10">
      <p className="text-sm font-medium text-green">
        FRONTEND FIRST · SELF-PACED
      </p>
      <h1 className="mt-4 text-4xl font-medium tracking-tight">
        Your learning roadmap.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-8 text-muted-ink">
        Start with how the web works. Build your JavaScript, TypeScript and
        React skills, then put them to work in real interfaces. Follow the
        stages in order or revisit a topic you need.
      </p>
      <div className="my-7 rounded-xl border border-line bg-green-soft p-5 text-sm leading-7">
        <h2 className="font-medium">New to web development?</h2>
        <p className="mt-2 text-muted-ink">
          Begin with Web foundations. No deadline, assumed prior completion or
          locked lessons. Read, rebuild the example, and check your
          understanding before moving on. The library is growing, so these
          stages guide the available material rather than promise an exhaustive
          course.
        </p>
        <a
          href="/paths/plan-week-1"
          className="mt-3 inline-flex min-h-11 items-center gap-2 font-medium text-green"
        >
          Start with the foundations
          <ArrowRight size={16} />
        </a>
      </div>
      <div className="space-y-5">
        {studyWeeks.map((stage) => {
          const lessons = stage.slugs
            .map((slug) => topicBySlug.get(slug)!)
            .filter(Boolean);
          const done = lessons.filter((t) => read.includes(t.slug)).length;
          return (
            <section
              key={stage.id}
              className="rounded-xl border border-line p-5 sm:p-6"
            >
              <p className="text-sm text-green">
                {stage.number >= 9
                  ? "OPTIONAL EXTENSION"
                  : `STAGE ${stage.number}`}
              </p>
              <h2 className="mt-2 text-2xl font-medium tracking-tight">
                {stage.title}
              </h2>
              <p className="my-3 text-sm leading-7 text-muted-ink">
                {stage.description}
              </p>
              <p className="mb-2 text-sm text-muted-ink">
                {done} of {lessons.length} lessons marked read
              </p>
              <ProgressMeter
                value={done}
                max={lessons.length}
                label={`${stage.title} reading progress`}
              />
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {lessons.map((topic) => (
                  <li key={topic.slug}>
                    <a
                      href={`/topic/${topic.slug}`}
                      className="flex min-h-11 items-center gap-2 rounded-lg border border-line px-3 py-3 text-sm hover:border-green"
                    >
                      {read.includes(topic.slug) ? (
                        <Check size={15} className="shrink-0 text-green" />
                      ) : (
                        <BookOpen
                          size={15}
                          className="shrink-0 text-muted-ink"
                        />
                      )}
                      {topic.title}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-7 text-muted-ink">
                <strong className="font-medium text-ink">
                  Before moving on:{" "}
                </strong>
                {stage.gate}
              </p>
              <div className="mt-4 flex flex-wrap gap-5 text-sm font-medium text-green">
                <a
                  href={`/paths/${stage.id}`}
                  className="inline-flex min-h-11 items-center gap-2"
                >
                  Follow this stage
                  <ArrowRight size={15} />
                </a>
                <a
                  className="inline-flex min-h-11 items-center"
                  href={`/practice/path/${stage.id}`}
                >
                  Practice these topics →
                </a>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
