import type { Topic } from "../data/content";
import { CodeBlock } from "@/components/content/code-block";
import { StudyDisclosure } from "./study-disclosure";
export function TopicWorkshop({ topic }: { topic: Topic }) {
  const guide = topic.study;
  if (!guide) return null;
  return (
    <section
      aria-label="Study workshop"
      className="my-8 space-y-5 rounded-xl border border-line bg-surface p-4 sm:p-6"
    >
      <div>
        <p className="text-sm font-medium text-green">FROM READING TO RECALL</p>
        <h2
          id="make-it-stick"
          className="mt-2 text-xl font-medium tracking-tight text-ink"
        >
          Make it stick
        </h2>
        <p className="mt-2 text-sm leading-7 text-muted-ink">
          Look away from the notes. Answer aloud, then attempt the exercise
          before opening the reference.
        </p>
      </div>
      <div className="space-y-3">
        <h3 className="text-base font-medium text-ink">
          Explain it without looking
        </h3>
        <p className="text-sm leading-7 text-ink">{guide.recall}</p>
        <StudyDisclosure title="Compare your explanation">
          <p>{topic.questions[0].answer}</p>
          <p className="mt-2">
            Explain why that is true and give a counterexample to a common
            misconception.
          </p>
        </StudyDisclosure>
      </div>
      <div className="space-y-3 border-t border-line pt-5">
        <h3 className="text-base font-medium text-ink">
          Rebuild the worked example
        </h3>
        <p className="text-sm leading-7 text-ink">{guide.exercise.task}</p>
        <div className="rounded-lg bg-page p-3 text-sm leading-7 text-muted-ink">
          <strong className="font-medium text-ink">
            Edge-case challenge.{" "}
          </strong>
          {guide.exercise.edgeCases}
        </div>
        <StudyDisclosure title="Reveal exercise hint">
          <p>{guide.exercise.hint}</p>
        </StudyDisclosure>
        <StudyDisclosure title="Reveal reference solution">
          <p className="mb-4">
            This is the lesson’s worked reference for the reconstruction task.
            Run or adapt it in your own environment; it is not an automatic
            grader or a complete implementation of every edge-case extension.
          </p>
          <CodeBlock code={topic.code} language={topic.codeLanguage || "tsx"} />
          <h4 className="mt-4 font-medium text-ink">Why this approach</h4>
          <ul className="list-disc space-y-2 pl-5">
            {guide.exercise.solutionNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          <h4 className="mt-4 font-medium text-ink">Check your attempt</h4>
          <ul className="list-disc space-y-2 pl-5">
            {guide.exercise.successCriteria.map((check) => (
              <li key={check}>{check}</li>
            ))}
          </ul>
        </StudyDisclosure>
      </div>
    </section>
  );
}
