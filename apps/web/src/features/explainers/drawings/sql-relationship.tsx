import { exampleNotes, exampleTags, leftJoinExample } from "./drawing-models";
import { ArrowDown, ArrowRight, KeyRound, Link2 } from "lucide-react";
const cell = "border-b border-line px-3 py-2 text-left text-sm";
function KeyValue({ value, linked }: { value: number; linked?: boolean }) {
  return (
    <span
      className={`inline-flex size-7 items-center justify-center rounded-md border font-mono ${linked ? "border-green/50 bg-green-soft font-semibold text-green" : "border-dashed border-line"}`}
    >
      {value}
    </span>
  );
}
export function SqlRelationshipDrawing() {
  const joined = leftJoinExample();
  return (
    <figure
      aria-label="One-to-many note and tag relationship with LEFT JOIN results"
      className="@container my-5 rounded-xl border border-line bg-page p-3 sm:p-5"
    >
      <figcaption className="mb-4 text-base font-medium">
        One note. Two matching tag rows.
      </figcaption>
      <div className="grid items-center gap-3 @min-[560px]:grid-cols-[minmax(0,1fr)_36px_minmax(0,1fr)]">
        <div className="min-w-0 overflow-x-auto rounded-lg border border-line">
          <table className="w-full border-collapse">
            <caption className="border-b border-line bg-surface px-3 py-2 text-left font-mono text-sm font-semibold">
              notes
            </caption>
            <thead>
              <tr>
                <th scope="col" className={cell}>
                  <span className="flex items-center gap-1">
                    <KeyRound size={13} aria-hidden="true" />
                    id · PK
                  </span>
                </th>
                <th scope="col" className={cell}>
                  title
                </th>
              </tr>
            </thead>
            <tbody>
              {exampleNotes.map((note) => (
                <tr
                  key={note.id}
                  className={note.id === 1 ? "bg-green-soft/50" : ""}
                >
                  <td className={cell}>
                    <KeyValue value={note.id} linked={note.id === 1} />
                  </td>
                  <td className={cell}>{note.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col items-center gap-1 text-green">
          <span className="font-mono text-xs">1:N</span>
          <ArrowRight
            size={24}
            className="hidden @min-[560px]:block"
            aria-hidden="true"
          />
          <ArrowDown
            size={24}
            className="@min-[560px]:hidden"
            aria-hidden="true"
          />
        </div>
        <div className="min-w-0 overflow-x-auto rounded-lg border border-line">
          <table className="w-full border-collapse">
            <caption className="border-b border-line bg-surface px-3 py-2 text-left font-mono text-sm font-semibold">
              tags
            </caption>
            <thead>
              <tr>
                <th scope="col" className={cell}>
                  id · PK
                </th>
                <th scope="col" className={cell}>
                  note_id · FK
                </th>
                <th scope="col" className={cell}>
                  label
                </th>
              </tr>
            </thead>
            <tbody>
              {exampleTags.map((tag) => (
                <tr key={tag.id}>
                  <td className={cell}>{tag.id}</td>
                  <td className={cell}>
                    <KeyValue value={tag.noteId} linked />
                  </td>
                  <td className={cell}>{tag.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="my-4 flex items-start gap-2 text-sm leading-relaxed text-muted-ink">
        <Link2
          size={17}
          className="mt-0.5 shrink-0 text-green"
          aria-hidden="true"
        />
        <span>
          <code className="font-mono text-ink">notes.id = tags.note_id</code>
          <br />
          Both highlighted foreign keys match note 1. Note 2 has no matching
          tag.
        </span>
      </p>
      <div className="mb-3 flex items-center justify-center gap-2 text-sm text-green">
        <ArrowDown size={18} aria-hidden="true" />
        <span>LEFT JOIN · preserve every left-side note</span>
      </div>
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full border-collapse">
          <caption className="border-b border-line bg-surface px-3 py-2 text-left text-sm font-semibold">
            Joined result · {joined.length} rows
          </caption>
          <thead>
            <tr>
              <th scope="col" className={cell}>
                note_id
              </th>
              <th scope="col" className={cell}>
                title
              </th>
              <th scope="col" className={cell}>
                tag
              </th>
            </tr>
          </thead>
          <tbody>
            {joined.map((row) => (
              <tr
                key={`${row.noteId}-${row.tagId ?? "none"}`}
                className={row.tag === null ? "bg-surface-hover" : ""}
              >
                <td className={cell}>{row.noteId}</td>
                <td className={cell}>{row.title}</td>
                <td className={cell}>
                  {row.tag ?? (
                    <span className="rounded border border-dashed border-line px-2 py-1 font-mono text-sm">
                      NULL
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <p className="rounded-lg border border-line p-3 text-sm leading-relaxed">
          <strong className="block font-medium">INNER JOIN</strong>Only the 2
          matched React rows remain.
        </p>
        <p className="rounded-lg border border-green/40 bg-green-soft p-3 text-sm leading-relaxed">
          <strong className="block font-medium">LEFT JOIN</strong>All 3 rows
          remain, including SQL + NULL.
        </p>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-ink">
        For the SQL note,{" "}
        <code className="font-mono text-ink">COUNT(tags.id) = 0</code>, while{" "}
        <code className="font-mono text-ink">COUNT(*) = 1</code> counts its
        preserved row. This intentionally simple schema gives each tag row one
        note owner.
      </p>
    </figure>
  );
}
