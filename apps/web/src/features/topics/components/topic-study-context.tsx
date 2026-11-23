import type { Topic } from "../data/content";
import { topicBySlug } from "../data/content";
export function TopicStudyContext({ topic }: { topic: Topic }) {
  const guide = topic.study;
  if (!guide) return null;
  return (
    <section aria-label="Lesson preparation" className="mb-7 space-y-4">
      <div className="rounded-lg border border-line bg-surface p-4 text-sm leading-7">
        <h2 className="font-medium text-ink">Before this lesson</h2>
        {guide.prerequisites.length ? (
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
            {guide.prerequisites.map((slug) => {
              const prerequisite = topicBySlug.get(slug);
              return prerequisite ? (
                <li key={slug}>
                  <a
                    className="text-green underline underline-offset-4"
                    href={`/topic/${slug}`}
                  >
                    {prerequisite.title}
                  </a>
                </li>
              ) : null;
            })}
          </ul>
        ) : (
          <p className="text-muted-ink">
            No prerequisite lesson. Start here and use the worked example to
            build your baseline.
          </p>
        )}
        <p className="mt-2 text-muted-ink">
          Prerequisites are suggestions, not locked steps.
        </p>
      </div>
    </section>
  );
}
