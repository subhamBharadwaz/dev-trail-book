import type { Topic } from "../data/content";
import { topicBySlug } from "../data/content";
import { StudyDisclosure } from "./study-disclosure";
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
                    href={`#/topic/${slug}`}
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
      <StudyDisclosure title="Content review & version notes">
        <dl className="space-y-2">
          <div>
            <dt className="font-medium text-ink">Study guidance revised</dt>
            <dd>
              <time dateTime={guide.review.revisedOn}>
                {guide.review.revisedOn}
              </time>
            </dd>
          </div>
          <div>
            <dt className="font-medium text-ink">Technical review</dt>
            <dd>
              {guide.review.reviewedOn ? (
                <>
                  Reviewed{" "}
                  <time dateTime={guide.review.reviewedOn}>
                    {guide.review.reviewedOn}
                  </time>
                </>
              ) : (
                "Pending. The revision date does not certify that every example was executed or checked against the latest release."
              )}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-ink">Version scope</dt>
            <dd>{guide.review.versionNote}</dd>
          </div>
        </dl>
        <a
          className="mt-3 inline-block text-green underline underline-offset-4"
          href={topic.source}
          target="_blank"
          rel="noreferrer"
        >
          Check the lesson reference
        </a>
      </StudyDisclosure>
    </section>
  );
}
