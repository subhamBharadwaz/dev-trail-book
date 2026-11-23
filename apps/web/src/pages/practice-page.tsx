import { usePracticePreferences } from "@/features/practice/hooks/use-practice-preferences";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select";
import { ChevronDown, Layers3, ListChecks } from "lucide-react";
import { categories } from "@/features/topics/data/content";
import { flashcards, quizCards } from "@/features/practice/data/practice-cards";
import { PracticeSession } from "@/features/practice/components/practice-session";
import type { LearningPath } from "@/features/learning-paths/data/learning-paths";
export function PracticePage({ path }: { path?: LearningPath }) {
  const [preferences, setPreferences] = usePracticePreferences(
    path?.id || "all",
  );
  const { category, mode } = preferences;
  const setCategory = (value: string | null) => {
    if (value) setPreferences((current) => ({ ...current, category: value }));
  };
  const scope = path ? `path:${path.id}` : category || "all";
  const matches = (card: (typeof flashcards)[number]) =>
    path
      ? path.slugs.includes(card.topicSlug)
      : category === "all" || card.category === category;
  const cards = flashcards.filter(matches);
  const quizzes = quizCards.filter(matches);
  const options = [
    { value: "all", label: "All collections" },
    ...categories.map((item) => ({ value: item.id, label: item.name })),
  ];
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:px-8 lg:px-10">
      <p className="text-sm font-medium uppercase tracking-[.15em] text-green">
        TURN FAMILIAR INTO UNDERSTOOD
      </p>
      <h1 className="mt-4 text-4xl font-medium tracking-tight">
        A little practice. A stronger memory.
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-muted-ink">
        Recall a concept, check your understanding, and revisit what needs
        another look. Pick up where you left off.
      </p>
      <div className="my-8 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
        {path ? (
          <div>
            <p className="text-sm text-muted-ink">Practicing this path</p>
            <a
              href={`/paths/${path.id}`}
              className="mt-1.5 block text-sm font-medium text-green"
            >
              {path.title}
            </a>
          </div>
        ) : (
          <Select items={options} value={category} onValueChange={setCategory}>
            <SelectLabel className="sr-only">Practice collection</SelectLabel>
            <SelectTrigger className="inline-flex min-w-48 items-center justify-between gap-8 rounded-lg border border-line bg-page px-3 py-2.5 text-sm text-ink">
              <SelectValue />
              <ChevronDown size={14} />
            </SelectTrigger>
            <SelectContent className="z-50 min-w-52 rounded-xl border border-line bg-page p-1.5 text-ink shadow-xl">
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="cursor-pointer rounded-md px-3 py-2.5 text-sm outline-none data-highlighted:bg-green-soft data-highlighted:text-green"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <span className="text-sm text-muted-ink">
          {cards.length} flashcards · {quizzes.length} quiz questions
        </span>
      </div>
      <a
        href="/mistakes"
        className="mb-6 inline-flex min-h-11 items-center text-base font-medium text-green"
      >
        Open mistake notebook →
      </a>
      <a
        href="/interviews"
        className="mb-6 ml-5 inline-flex min-h-11 items-center text-base font-medium text-green"
      >
        Try a timed mock interview →
      </a>
      <Tabs
        value={mode}
        onValueChange={(value) => {
          if (value === "quiz" || value === "flashcards")
            setPreferences((current) => ({ ...current, mode: value }));
        }}
      >
        <TabsList
          aria-label="Practice mode"
          className="mb-6 inline-flex gap-1 rounded-xl border border-line bg-surface p-1"
        >
          <TabsTab
            value="flashcards"
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-muted-ink aria-selected:bg-page aria-selected:text-green aria-selected:shadow-sm"
          >
            <Layers3 size={15} aria-hidden="true" />
            Flashcards
          </TabsTab>
          <TabsTab
            value="quiz"
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-muted-ink aria-selected:bg-page aria-selected:text-green aria-selected:shadow-sm"
          >
            <ListChecks size={15} aria-hidden="true" />
            Quick quiz
          </TabsTab>
        </TabsList>
        <TabsPanel value="flashcards">
          <PracticeSession
            key={`${scope}:flashcards`}
            cards={cards}
            mode="flashcards"
            scope={scope}
          />
        </TabsPanel>
        <TabsPanel value="quiz">
          <PracticeSession
            key={`${scope}:quiz`}
            cards={quizzes}
            mode="quiz"
            scope={scope}
          />
        </TabsPanel>
      </Tabs>
      {path && (
        <a href="/practice" className="mt-7 inline-flex text-sm text-green">
          Explore practice across all collections
        </a>
      )}
    </div>
  );
}
