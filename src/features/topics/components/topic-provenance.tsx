import type { Topic } from "../data/content";
export function TopicProvenance({ topic }: { topic: Topic }) {
  if (!topic.planWeek && !topic.discussionSource) return null;
  return (
    <div className="mb-7 rounded-lg border border-line bg-surface px-4 py-3 text-xs leading-6 text-muted-ink">
      {topic.discussionSource && (
        <p>
          Discussion reference:{" "}
          <a
            className="font-medium text-green underline underline-offset-2"
            href={topic.discussionSource.url}
            target="_blank"
            rel="noreferrer"
          >
            {topic.discussionSource.title}
          </a>
          . This is a refined explanation of the accessible excerpt.
        </p>
      )}
      {topic.planWeek && (
        <p>
          Study plan · Week {topic.planWeek} · PDF page{" "}
          {topic.planPages?.join(", ")}. Expanded study material for the
          syllabus topic; examples are illustrative and may use
          application-specific helpers.
        </p>
      )}
      {topic.planRecordedStatus === "covered" && (
        <p className="mt-1 font-medium text-green">
          The PDF records prior study of this topic. Try recall first; your
          saved reading status stays independent.
        </p>
      )}
      {topic.planRecordedStatus === "pending" && (
        <p className="mt-1">
          The PDF lists this practice as pending. Unnamed exercises are
          explicitly offered as equivalents.
        </p>
      )}
      {topic.optional && (
        <p className="mt-1 font-medium">
          Optional in the plan. Prioritize core gaps and active interviews.
        </p>
      )}
      <a className="mt-1 inline-block font-medium text-green" href="#/roadmap">
        See the complete study roadmap →
      </a>
    </div>
  );
}
