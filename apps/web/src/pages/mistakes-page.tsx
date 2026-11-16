import { useState } from "react";
import { useNotebookDay } from "@/features/mistakes/use-notebook-day";
import { Input } from "@ui-sdk/react/input";
import { Tabs, TabsList, TabsTab, TabsPanel } from "@ui-sdk/react/tabs";
import { Button } from "@/components/ui/button";
import { newMistake, type Mistake } from "@trailbook/learning/mistakes";
import { useMistakes } from "@/features/mistakes/use-mistakes";
import { MistakeCard } from "@/features/mistakes/mistake-card";
import { MistakeEditor } from "@/features/mistakes/mistake-editor";
export function MistakesPage() {
  const { mistakes, save, storageError } = useMistakes();
  const today = useNotebookDay();
  const [filter, setFilter] = useState("due");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Mistake | null>(null);
  const due = mistakes.filter(
    (m) => m.status === "open" && m.due <= today,
  ).length;
  const mastered = mistakes.filter((m) => m.status === "mastered").length;
  const visible = mistakes.filter(
    (m) =>
      (filter === "all" ||
        (filter === "mastered"
          ? m.status === "mastered"
          : m.status === "open" && (filter === "open" || m.due <= today))) &&
      `${m.question} ${m.topicTitle} ${m.explanation} ${m.category}`
        .toLowerCase()
        .includes(search.toLowerCase().trim()),
  );
  return (
    <div className="mx-auto max-w-4xl space-y-7 px-5 py-8 sm:px-8 sm:py-12">
      <header>
        <p className="text-sm font-medium uppercase tracking-widest text-green">
          LEARN FROM THE GAP
        </p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
          Your mistake notebook.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted-ink">
          Keep the questions that caught you out. Explain the gap, then try
          again without a hint.
        </p>
      </header>
      <div className="grid grid-cols-3 gap-3 rounded-2xl border border-line bg-surface p-5">
        {[
          [due, "Due now"],
          [mistakes.length - mastered, "Learning"],
          [mastered, "Mastered"],
        ].map(([n, label]) => (
          <div key={label}>
            <p className="text-2xl font-medium text-green">{n}</p>
            <p className="mt-1 text-sm text-muted-ink">{label}</p>
          </div>
        ))}
      </div>
      <p className="text-sm leading-6 text-muted-ink">
        Missed practice answers appear automatically. Successful recalls
        schedule another retry in 1, then 3 days. Three consecutive recalls mark
        an entry mastered. Sign in to sync; guest notes stay on this device.
      </p>
      {storageError && (
        <p role="alert">
          Device storage could not be updated. Keep this page open and check
          Account & sync.
        </p>
      )}
      {editing ? (
        <MistakeEditor
          key={editing.id}
          initial={editing}
          onCancel={() => setEditing(null)}
          onSave={(m) => {
            save(m);
            setEditing(null);
          }}
        />
      ) : (
        <Button onClick={() => setEditing(newMistake(crypto.randomUUID()))}>
          Add a personal mistake
        </Button>
      )}
      <Input
        type="search"
        aria-label="Search mistake notebook"
        placeholder="Search questions, topics, or reflections…"
        value={search}
        onValueChange={setSearch}
        className="min-h-12 w-full rounded-xl border border-line bg-page px-4 text-base outline-none focus-visible:ring-2 focus-visible:ring-green"
      />
      <Tabs
        value={filter}
        onValueChange={(value) => {
          if (value) setFilter(value);
        }}
      >
        <TabsList aria-label="Mistake status" className="flex flex-wrap gap-2">
          {[
            ["due", `Due (${due})`],
            ["open", "Learning"],
            ["mastered", "Mastered"],
            ["all", "All entries"],
          ].map(([value, label]) => (
            <TabsTab
              key={value}
              value={value}
              className="min-h-11 rounded-lg border border-line px-4 text-sm aria-selected:bg-green-soft aria-selected:text-green"
            >
              {label}
            </TabsTab>
          ))}
        </TabsList>
        {["due", "open", "mastered", "all"].map((value) => (
          <TabsPanel key={value} value={value} className="mt-6 space-y-5">
            {visible.length ? (
              visible.map((m) => (
                <MistakeCard
                  key={`${m.id}:${m.updatedAt}`}
                  mistake={m}
                  save={save}
                  edit={() => setEditing(m)}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-line p-8 text-center">
                <h2 className="text-xl font-medium">
                  {mistakes.length
                    ? "Nothing in this view."
                    : "Every gap is a place to grow."}
                </h2>
                <p className="mt-3 text-base leading-7 text-muted-ink">
                  {mistakes.length
                    ? "Try another filter or come back when your next retry is due."
                    : "Add a personal mistake or try a quiz. Missed answers will be saved here."}
                </p>
                <a
                  href="#/practice"
                  className="mt-5 inline-flex min-h-11 items-center font-medium text-green"
                >
                  Go to practice →
                </a>
              </div>
            )}
          </TabsPanel>
        ))}
      </Tabs>
    </div>
  );
}
