import { useEffect, useRef } from "react";
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio";
import { ArrowRight, BookOpen, Check, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressMeter } from "@/components/ui/progress-meter";
import type { PracticeCard } from "../data/practice-cards";
import { usePracticeSession } from "../hooks/use-practice-session";
interface Props {
  cards: PracticeCard[];
  mode: "flashcards" | "quiz";
  scope: string;
}
export function PracticeSession({ cards, mode, scope }: Props) {
  const practice = usePracticeSession(cards, `${scope}:${mode}`);
  const { session, current, answered, correct, missed } = practice;
  const heading = useRef<HTMLHeadingElement>(null);
  const previous = useRef(session.index);
  useEffect(() => {
    if (previous.current !== session.index) {
      heading.current?.focus();
      previous.current = session.index;
    }
  }, [session.index]);
  if (!cards.length)
    return (
      <div className="rounded-xl border border-dashed border-line p-10 text-center">
        <BookOpen className="mx-auto text-green" />
        <h2 className="mt-4 text-lg font-medium">
          No practice cards here yet.
        </h2>
        <p className="mt-3 text-sm text-muted-ink">
          Choose another collection or add questions to your topic notes.
        </p>
      </div>
    );
  if (!current)
    return (
      <section className="rounded-2xl border border-line bg-surface px-6 py-12 text-center">
        <Trophy size={35} className="mx-auto text-green" />
        <p className="mt-5 text-sm uppercase tracking-[.15em] text-green">
          SESSION COMPLETE
        </p>
        <h2
          ref={heading}
          tabIndex={-1}
          className="mt-3 text-3xl font-medium tracking-tight outline-none"
        >
          {correct} of {session.ids.length}{" "}
          {mode === "quiz" ? "correct" : "remembered"}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-ink">
          {missed.length
            ? "A useful signal, not a final grade. Revisit the questions that need another look."
            : "Nicely connected. Come back later and see what you can recall without a hint."}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {missed.length > 0 && (
            <Button
              onClick={() => practice.restart(true)}
              className="h-10 bg-[#2c684e] px-4 text-white hover:bg-[#20513b]"
            >
              Review missed ({missed.length})<ArrowRight />
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => practice.restart()}
            className="h-10 px-4"
          >
            <RotateCcw />
            Start a new session
          </Button>
        </div>
        <a
          href="#/paths"
          className="mt-7 inline-flex text-sm font-medium text-green"
        >
          Back to learning paths
        </a>
      </section>
    );
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-page">
      <div className="border-b border-line bg-surface px-6 py-5">
        <div className="mb-3 flex items-center justify-between gap-3 text-sm text-muted-ink">
          <span>
            {mode === "quiz" ? "QUESTION" : "FLASHCARD"} {session.index + 1} /{" "}
            {session.ids.length}
          </span>
          <span>
            {correct} {mode === "quiz" ? "correct" : "remembered"}
          </span>
        </div>
        <ProgressMeter
          value={session.index}
          max={session.ids.length}
          label="Practice progress"
        />
      </div>
      <div className="p-6 sm:p-8">
        <a
          href={`#/topic/${current.topicSlug}`}
          className="text-sm font-medium uppercase tracking-wider text-green"
        >
          {current.topicTitle}
        </a>
        <h2
          ref={heading}
          tabIndex={-1}
          className="mt-5 text-2xl font-medium leading-snug tracking-tight outline-none"
          id="practice-question"
        >
          {current.question}
        </h2>
        {mode === "quiz" ? (
          <RadioGroup
            aria-labelledby="practice-question"
            aria-label="Your answer"
            value={session.selected}
            onValueChange={(value) => {
              if (!answered) practice.choose(value);
            }}
            disabled={answered}
            className="mt-7 space-y-3"
          >
            {current.options.map((option, index) => (
              <label
                key={option.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm leading-7 ${answered && option.id === current.correctId ? "border-green bg-green-soft" : answered && session.selected === option.id ? "border-[#bd695e] bg-[#bd695e]/10" : "border-line has-[[data-checked]]:border-green has-[[data-checked]]:bg-green-soft"}`}
              >
                <Radio
                  value={option.id}
                  className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border border-muted-ink data-checked:border-green data-checked:bg-green data-checked:text-page"
                >
                  <RadioIndicator>
                    <Check size={12} />
                  </RadioIndicator>
                </Radio>
                <span>
                  <span className="mr-2 font-mono text-sm text-muted-ink">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option.text}
                </span>
              </label>
            ))}
          </RadioGroup>
        ) : (
          <p className="mt-5 text-sm leading-7 text-muted-ink">
            Try answering out loud before you reveal the explanation.
          </p>
        )}
        {session.revealed && (
          <div
            role="status"
            className="mt-6 rounded-xl border border-line bg-surface p-5"
          >
            <strong className="text-sm font-medium text-green">
              {mode === "flashcards"
                ? "The answer"
                : session.results[current.id]
                  ? "That’s right."
                  : "A detail to revisit."}
            </strong>
            <p className="mt-3 text-sm leading-7 text-muted-ink">
              {current.answer}
            </p>
            <a
              href={`#/topic/${current.topicSlug}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-green"
            >
              Revisit the full explanation
              <ArrowRight size={13} />
            </a>
          </div>
        )}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          {mode === "quiz" ? (
            answered ? (
              <Button
                onClick={practice.next}
                className="h-10 bg-[#2c684e] px-5 text-white hover:bg-[#20513b]"
              >
                {session.index === session.ids.length - 1
                  ? "See results"
                  : "Next question"}
                <ArrowRight />
              </Button>
            ) : (
              <Button
                onClick={practice.check}
                disabled={!session.selected}
                className="h-10 bg-[#2c684e] px-5 text-white hover:bg-[#20513b]"
              >
                Check answer
              </Button>
            )
          ) : session.revealed ? (
            <>
              <Button
                variant="outline"
                className="h-10 px-5"
                onClick={() => practice.grade(false)}
              >
                <RotateCcw />
                Needs another look
              </Button>
              <Button
                className="h-10 bg-[#2c684e] px-5 text-white hover:bg-[#20513b]"
                onClick={() => practice.grade(true)}
              >
                <Check />
                Got it
              </Button>
            </>
          ) : (
            <Button
              onClick={practice.reveal}
              className="h-10 bg-[#2c684e] px-5 text-white hover:bg-[#20513b]"
            >
              Reveal answer
              <ArrowRight />
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-line px-6 py-4 text-sm leading-5 text-muted-ink">
        <span>Progress is saved on this browser.</span>
        <span>
          {mode === "quiz"
            ? "Choose, check, reflect."
            : "Recall first. Then reflect."}
        </span>
      </div>
    </section>
  );
}
