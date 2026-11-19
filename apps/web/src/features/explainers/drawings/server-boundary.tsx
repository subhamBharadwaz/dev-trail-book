import {
  ArrowDown,
  ArrowRight,
  Database,
  LockKeyhole,
  Monitor,
  Server,
} from "lucide-react";
export function ServerBoundaryDrawing() {
  return (
    <figure
      aria-label="Server and browser zones with a filtered data boundary"
      className="@container my-5 rounded-xl border border-line bg-page p-3 sm:p-5"
    >
      <figcaption className="mb-4 text-base font-medium">
        What crosses into the browser?
      </figcaption>
      <div className="grid items-stretch gap-3 @min-[560px]:grid-cols-[minmax(0,1fr)_40px_minmax(0,1fr)]">
        <section
          aria-label="Server zone"
          className="min-w-0 rounded-xl border-2 border-green/50 bg-green-soft p-3"
        >
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Server size={18} aria-hidden="true" />
            Server zone
          </h3>
          <div className="my-4 flex items-center justify-center gap-2 rounded-lg border border-line bg-page p-3 text-sm">
            <Database size={17} aria-hidden="true" />
            Authorized database read
          </div>
          <div className="rounded-lg border border-line bg-page p-3 font-mono text-sm leading-7">
            <div>
              id: <span className="font-semibold">42</span>
            </div>
            <div>
              title: <span className="font-semibold">"Closures"</span>
            </div>
            <div className="text-muted-ink">ownerId: "user-A"</div>
            <div className="text-muted-ink">audit: "internal"</div>
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-dashed border-green/50 p-3 text-sm">
            <LockKeyhole
              size={17}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />
            <p>
              <strong className="block font-medium">Stays on the server</strong>
              <span className="text-muted-ink">
                Database credentials, private fields, authorization logic.
              </span>
            </p>
          </div>
        </section>
        <div className="flex items-center justify-center text-green">
          <ArrowDown
            className="@min-[560px]:hidden"
            size={24}
            aria-hidden="true"
          />
          <ArrowRight
            className="hidden @min-[560px]:block"
            size={26}
            aria-hidden="true"
          />
          <span className="sr-only">
            Only the safe view model crosses to the browser.
          </span>
        </div>
        <section
          aria-label="Browser zone"
          className="min-w-0 rounded-xl border-2 border-dashed border-green/50 p-3"
        >
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Monitor size={18} aria-hidden="true" />
            Browser zone
          </h3>
          <div className="my-4 rounded-lg border border-green/40 bg-green-soft p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-green">
              Allowed props
            </p>
            <pre
              aria-label="Public view model"
              className="mt-2 whitespace-pre-wrap break-words font-mono text-sm leading-7"
            >
              {'{ id: 42,\n  title: "Closures" }'}
            </pre>
          </div>
          <div className="overflow-hidden rounded-lg border border-line bg-surface">
            <div
              className="flex gap-1 border-b border-line p-2"
              aria-hidden="true"
            >
              <span className="size-2 rounded-full bg-line" />
              <span className="size-2 rounded-full bg-line" />
              <span className="size-2 rounded-full bg-line" />
            </div>
            <div className="p-3">
              <p className="text-xs text-muted-ink">Rendered note</p>
              <p className="mt-1 font-medium">Closures</p>
              <div className="mt-3 rounded border border-line bg-page px-2 py-1 font-mono text-sm">
                query: "clo"
              </div>
              <p className="mt-2 text-xs text-muted-ink">
                Filter interaction lives here
              </p>
            </div>
          </div>
        </section>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-ink">
        <strong className="font-medium text-ink">
          42 + “Closures” cross the boundary.
        </strong>{" "}
        Private fields do not. This shows logical ownership, not the literal RSC
        wire format. Client Components can also participate in initial
        server-rendered HTML.
      </p>
    </figure>
  );
}
