import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bookmark,
  Check,
  Database,
  FileCode2,
  Focus,
  KeyRound,
  Layers3,
  LockKeyhole,
  Monitor,
  Search,
} from "lucide-react";
import type { Schematic } from "./schematic-types";
type SpecialKind = Exclude<
  Schematic["kind"],
  | "sequence"
  | "flow"
  | "fork"
  | "states"
  | "cycle"
  | "security"
  | "waterfall"
  | "funnel"
>;
const frame = "min-w-0 rounded-xl border border-line bg-surface p-3";
const code = "rounded border border-line bg-page px-2 py-1 font-mono text-sm";
export function ConceptScenes({ kind }: { kind: SpecialKind }) {
  switch (kind) {
    case "accessibility":
      return (
        <div>
          <div className="grid grid-cols-2 gap-3">
            <p className={frame}>
              <span className="block text-xs font-semibold uppercase text-green">
                Accessible name
              </span>
              <samp className="mt-2 block text-sm">Save topic</samp>
            </p>
            <p className={frame}>
              <span className="block text-xs font-semibold uppercase text-green">
                Exposed state
              </span>
              <samp className="mt-2 block text-sm">aria-pressed=true</samp>
            </p>
          </div>
          <div className="my-4 flex justify-around text-green">
            <ArrowDown size={20} aria-hidden="true" />
            <ArrowDown size={20} aria-hidden="true" />
          </div>
          <div className="mx-auto w-fit rounded-xl border-2 border-dashed border-green p-2">
            <div className="flex items-center gap-2 rounded-lg border border-green/50 bg-green-soft px-5 py-4 text-sm font-semibold">
              <Bookmark size={20} aria-hidden="true" />
              Save topic
              <Check size={17} aria-hidden="true" />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
            <kbd className={code}>Tab</kbd>
            <ArrowRight size={17} aria-hidden="true" />
            <span className="flex items-center gap-1">
              <Focus size={17} aria-hidden="true" />
              Visible focus
            </span>
            <ArrowRight size={17} aria-hidden="true" />
            <kbd className={code}>Space / Enter</kbd>
          </div>
          <p className="mt-4 text-center text-sm text-muted-ink">
            Illustrated toggle, not an active control. Name, focus, and state
            describe the same action.
          </p>
        </div>
      );
    case "cache":
      return (
        <div>
          <div className={`${frame} text-center`}>
            <Monitor
              className="mx-auto mb-2 text-green"
              size={22}
              aria-hidden="true"
            />
            <h3 className="font-semibold">Browser navigation cache</h3>
            <p className="mt-2 font-mono text-sm">
              Valid hit → reuse permitted UI
            </p>
          </div>
          <p className="my-3 flex items-center justify-center gap-2 text-sm text-green">
            <ArrowDown size={18} aria-hidden="true" />
            Navigation requires server work
          </p>
          <div className="rounded-xl border-2 border-dashed border-green/50 bg-green-soft p-3">
            <h3 className="mb-3 text-sm font-semibold">
              Server · distinct reuse scopes
            </h3>
            <div className="grid gap-3 @min-[480px]:grid-cols-3">
              {[
                ["Request memo", "One render/request"],
                ["Data cache", "Configured cross-request reuse"],
                ["Route output", "Rendered output reuse"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg border border-line bg-page p-3"
                >
                  <Layers3
                    className="mb-2 text-green"
                    size={22}
                    aria-hidden="true"
                  />
                  <h4 className="text-sm font-semibold">{label}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-muted-ink">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="my-3 flex items-center justify-center gap-2 text-sm text-green">
            <ArrowDown size={18} aria-hidden="true" />
            Required data is not reusable
          </div>
          <div className={`${frame} text-center`}>
            <Database
              className="mx-auto mb-2 text-green"
              size={24}
              aria-hidden="true"
            />
            <h3 className="text-sm font-semibold">Authorized origin read</h3>
            <p className="mt-2 font-mono text-sm">
              Public catalog ≠ private balance
            </p>
          </div>
          <p className="mt-3 text-sm text-muted-ink">
            These are different scopes, not a mandatory four-cache pipeline. A
            hit or invalidation in one does not prove another is fresh.
          </p>
        </div>
      );
    case "payloads":
      return (
        <div>
          <div className="rounded-xl border-2 border-green/40 bg-green-soft p-3">
            <h3 className="mb-4 text-sm font-semibold">
              Initial server response · different representations
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                ["HTML", "Initial document"],
                ["RSC", "Output + client references"],
                ["Client JS", "Interactive implementation"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="min-w-0 rounded-lg border border-line bg-page p-2 text-center"
                >
                  <FileCode2
                    className="mx-auto mb-2 text-green"
                    size={27}
                    aria-hidden="true"
                  />
                  <h4 className="font-mono text-sm font-semibold">{label}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-muted-ink">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="my-4 flex justify-around text-green">
            {[0, 1, 2].map((i) => (
              <ArrowDown key={i} size={22} aria-hidden="true" />
            ))}
          </div>
          <div className="rounded-xl border-2 border-dashed border-green/40 p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Monitor size={22} aria-hidden="true" />
              Browser
            </h3>
            <div className="mt-4 flex flex-col items-center gap-3">
              <span className={code}>Display compatible HTML</span>
              <ArrowDown size={18} className="text-green" aria-hidden="true" />
              <span className={code}>Hydrate client behavior</span>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-ink">
            The RSC payload is not simply HTML. Client Components can contribute
            to initial server-rendered markup.
          </p>
        </div>
      );
    case "pagination":
      return <PaginationScene />;
    case "tokens":
      return (
        <div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#dcd9d0] bg-[#f8f7f3] p-3 text-[#292832]">
              <h3 className="text-sm font-semibold">Paper palette</h3>
              <div className="mt-3 flex gap-2" aria-hidden="true">
                <span className="size-9 rounded bg-[#f8f7f3] ring-1 ring-[#dcd9d0]" />
                <span className="size-9 rounded bg-[#292832]" />
                <span className="size-9 rounded bg-[#514c8c]" />
              </div>
              <p className="mt-3 text-xs">surface · text · accent</p>
            </div>
            <div className="rounded-xl border border-[#504b58] bg-[#24222a] p-3 text-[#eae6ef]">
              <h3 className="text-sm font-semibold">Night palette</h3>
              <div className="mt-3 flex gap-2" aria-hidden="true">
                <span className="size-9 rounded bg-[#24222a] ring-1 ring-[#504b58]" />
                <span className="size-9 rounded bg-[#eae6ef]" />
                <span className="size-9 rounded bg-[#bcb1ed]" />
              </div>
              <p className="mt-3 text-xs">surface · text · accent</p>
            </div>
          </div>
          <ArrowDown
            className="mx-auto my-3 text-green"
            size={23}
            aria-hidden="true"
          />
          <div className="flex flex-wrap justify-center gap-2">
            {["bg-surface", "text-ink", "border-line", "text-green"].map(
              (name) => (
                <code key={name} className={code}>
                  {name}
                </code>
              ),
            )}
          </div>
          <ArrowDown
            className="mx-auto my-3 text-green"
            size={23}
            aria-hidden="true"
          />
          <div className="mx-auto max-w-sm rounded-xl border border-line bg-surface p-4">
            <p className="text-xs text-green">One component</p>
            <h3 className="mt-2 font-medium text-ink">Your field notes</h3>
            <p className="mt-2 text-sm text-muted-ink">
              Same semantic classes; theme supplies the values.
            </p>
          </div>
        </div>
      );
    case "collections":
      return (
        <div className="grid gap-4 @min-[480px]:grid-cols-2">
          <section className={frame}>
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Search size={19} aria-hidden="true" />
              Set · membership
            </h3>
            <p className="mt-3 font-mono text-sm">Input: [4, 1, 4]</p>
            <div className="mt-4 flex gap-2 rounded-lg border-2 border-dashed border-green/50 p-3">
              {[4, 1].map((n) => (
                <span key={n} className={code}>
                  {n}
                </span>
              ))}
            </div>
            <ArrowUp
              className="mx-auto my-2 text-green"
              size={20}
              aria-hidden="true"
            />
            <p className="text-center font-mono text-sm">
              next 4 → already present
            </p>
            <p className="mt-3 text-sm text-green">Duplicate found</p>
          </section>
          <section className={frame}>
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <KeyRound size={19} aria-hidden="true" />
              Map · frequencies
            </h3>
            <p className="mt-3 font-mono text-sm">"tea" vs "eat"</p>
            <table className="mt-4 w-full border-collapse text-sm">
              <caption className="sr-only">
                Character frequencies in tea
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="border-b border-line p-2 text-left"
                  >
                    Character
                  </th>
                  <th
                    scope="col"
                    className="border-b border-line p-2 text-left"
                  >
                    Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {["t", "e", "a"].map((char) => (
                  <tr key={char}>
                    <td className="border-b border-line p-2 font-mono">
                      {char}
                    </td>
                    <td className="border-b border-line p-2 font-mono">1</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-sm text-green">
              Matching counts → anagrams
            </p>
          </section>
        </div>
      );
    case "complexity":
      return (
        <div>
          <div className="mb-4 flex justify-between text-sm text-muted-ink">
            <span>Input n = 16</span>
            <span>Input n = 32</span>
          </div>
          <ul className="space-y-4">
            {[
              { name: "log₂ n", a: 4, b: 5 },
              { name: "n", a: 16, b: 32 },
              { name: "n log₂ n", a: 64, b: 160 },
              { name: "n²", a: 256, b: 1024 },
            ].map((row) => (
              <li key={row.name} className={frame}>
                <div className="mb-3 flex justify-between gap-3 font-mono text-sm">
                  <h3 className="font-semibold">{row.name}</h3>
                  <span>
                    {row.a} → {row.b}
                  </span>
                </div>
                <svg
                  viewBox="0 0 100 24"
                  preserveAspectRatio="none"
                  className="h-10 w-full"
                  aria-hidden="true"
                >
                  <rect
                    x="0"
                    y="1"
                    width={(row.a / row.b) * 98}
                    height="8"
                    rx="2"
                    className="fill-green-soft stroke-green"
                    strokeWidth="0.7"
                  />
                  <rect
                    x="0"
                    y="14"
                    width="98"
                    height="8"
                    rx="2"
                    className="fill-green"
                  />
                </svg>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-ink">
            Each pair of bars uses its own scale. Numbers are illustrative
            growth functions, not measured runtime or exact instruction counts.
          </p>
        </div>
      );
    case "tool-map":
      return <ToolMapScene />;
    case "sql-systems":
      return <SqlSystemsScene />;
  }
}
function PaginationScene() {
  const page = (label: string, rows: number[], highlight?: number) => (
    <div className={frame}>
      <h3 className="mb-3 text-sm font-semibold">{label}</h3>
      <ol className="space-y-2">
        {rows.map((id) => (
          <li
            key={id}
            className={`flex justify-between rounded border px-3 py-2 font-mono text-sm ${id === highlight ? "border-green bg-green-soft" : "border-line bg-page"}`}
          >
            <span>note {id}</span>
            {id === highlight && <span className="text-green">cursor</span>}
          </li>
        ))}
      </ol>
    </div>
  );
  return (
    <div>
      <p className="mb-3 font-mono text-sm text-green">
        ORDER BY id DESC · unique IDs · limit 2
      </p>
      <div className="grid grid-cols-2 gap-3">
        {page("First page", [9, 8], 8)}
        {page("New record arrives", [10])}
      </div>
      <ArrowDown
        size={22}
        className="mx-auto my-4 text-green"
        aria-hidden="true"
      />
      <div className="grid gap-3 @min-[440px]:grid-cols-2">
        <div>
          {page("Offset 2 after insertion", [8, 7])}
          <p className="mt-2 text-sm text-muted-ink">
            8 repeats: positions shifted.
          </p>
        </div>
        <div>
          {page("Cursor: id < 8", [7, 6])}
          <p className="mt-2 text-sm text-green">
            Continue after the stable key.
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-ink">
        A different ordering, such as timestamp + ID, needs a matching tuple
        cursor and predicate. This does not provide snapshot isolation.
      </p>
    </div>
  );
}
function ToolMapScene() {
  return (
    <div className="grid gap-3 @min-[440px]:grid-cols-2">
      <section className={frame}>
        <h3 className="text-sm font-semibold">Network · request order</h3>
        <svg
          viewBox="0 0 200 70"
          className="my-3 h-20 w-full"
          aria-hidden="true"
        >
          <rect
            x="5"
            y="10"
            width="85"
            height="16"
            rx="3"
            className="fill-green"
          />
          <rect
            x="90"
            y="40"
            width="85"
            height="16"
            rx="3"
            className="fill-green"
          />
        </svg>
        <p className="text-sm text-muted-ink">
          Are independent reads waiting for one another?
        </p>
      </section>
      <section className={frame}>
        <h3 className="text-sm font-semibold">React · render work</h3>
        <div
          className="my-3 flex h-20 items-end justify-center gap-2"
          aria-hidden="true"
        >
          {[25, 50, 25, 75, 25].map((h, i) => (
            <svg key={i} viewBox="0 0 20 80" className="h-20 w-5">
              <rect
                x="1"
                y={80 - h}
                width="18"
                height={h}
                rx="2"
                className="fill-green"
              />
            </svg>
          ))}
        </div>
        <p className="text-sm text-muted-ink">
          Which components render, how often, and for how long?
        </p>
      </section>
      <section className={frame}>
        <h3 className="text-sm font-semibold">Browser · frame work</h3>
        <div className="my-3 flex h-20 items-center gap-1 text-xs">
          <span className="flex-1 rounded border border-line bg-page p-2">
            Style
          </span>
          <span className="flex-1 rounded border border-green bg-green-soft p-2">
            Layout
          </span>
          <span className="flex-1 rounded border border-line bg-page p-2">
            Paint
          </span>
        </div>
        <p className="text-sm text-muted-ink">
          Does an interaction force repeated geometry work?
        </p>
      </section>
      <section className={frame}>
        <h3 className="text-sm font-semibold">Bundle · shipped code</h3>
        <div className="my-3 grid h-20 grid-cols-2 gap-1 text-xs">
          <span className="grid place-items-center rounded border border-line bg-page">
            Core
          </span>
          <span className="grid place-items-center rounded border border-green bg-green-soft">
            Editor
          </span>
        </div>
        <p className="text-sm text-muted-ink">
          Can rarely used code load later? These miniatures are schematic.
        </p>
      </section>
    </div>
  );
}
function SqlSystemsScene() {
  return (
    <div className="space-y-5">
      <section className={frame}>
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Search size={18} aria-hidden="true" />
          Index · narrow a compatible search
        </h3>
        <div className="mx-auto mt-4 w-fit rounded-lg border-2 border-green/50 bg-green-soft px-4 py-2 font-mono text-sm">
          owner = 42
        </div>
        <div className="my-2 flex justify-around text-green">
          {[1, 2, 3].map((i) => (
            <ArrowDown key={i} size={18} aria-hidden="true" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <span className="rounded border border-line bg-page p-2">
            Earlier range
          </span>
          <span className="rounded border border-green bg-green-soft p-2">
            Candidate rows
          </span>
          <span className="rounded border border-line bg-page p-2">
            Later range
          </span>
        </div>
        <p className="mt-3 text-xs text-muted-ink">
          Schematic ranges, not a literal index page. Measure the actual query
          plan.
        </p>
      </section>
      <section className="rounded-xl border-2 border-dashed border-green/50 bg-green-soft p-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <LockKeyhole size={18} aria-hidden="true" />
          Transaction · required writes together
        </h3>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 font-mono text-sm">
          <span className={code}>note INSERT</span>
          <span>+</span>
          <span className={code}>tag link INSERT</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-center text-sm">
          <span className="rounded border border-green/40 bg-page p-2">
            Both succeed → COMMIT
          </span>
          <span className="rounded border border-line bg-page p-2">
            Required write fails → ROLLBACK
          </span>
        </div>
      </section>
      <section className={frame}>
        <h3 className="text-sm font-semibold">
          Batching · reduce N+1 round trips
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <p className="font-mono text-sm">1 + 20 = 21 calls</p>
            <div className="mt-3 flex flex-wrap gap-1" aria-hidden="true">
              {Array.from({ length: 21 }, (_, i) => (
                <span
                  key={i}
                  className="size-3 rounded border border-green bg-green-soft"
                />
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono text-sm">1 + 1 = 2 calls</p>
            <div className="mt-3 flex gap-1" aria-hidden="true">
              <span className="size-3 rounded bg-green" />
              <span className="size-3 rounded bg-green" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
