import { boxDimensions } from "./drawing-models";
import { ArrowLeftRight } from "lucide-react";
export function BoxModelDrawing() {
  const content = boxDimensions(200, 16, 2, 16, "content-box"),
    border = boxDimensions(200, 16, 2, 16, "border-box");
  return (
    <figure
      aria-label="Nested CSS content, padding, border, and margin"
      className="my-5 rounded-xl border border-line bg-page p-3 sm:p-5"
    >
      <figcaption className="mb-4 text-base font-medium">
        Where does the declared width end?
      </figcaption>
      <div className="rounded-xl border-2 border-dashed border-line bg-surface-hover p-3 sm:p-4">
        <p className="mb-3 flex flex-wrap justify-between gap-1 text-sm">
          <strong className="font-medium">Margin</strong>
          <span>16 px · outside the border</span>
        </p>
        <div className="rounded-lg border-2 border-green bg-green-soft p-3 sm:p-4">
          <p className="mb-3 flex flex-wrap justify-between gap-1 text-sm text-green">
            <strong className="font-medium">Border</strong>
            <span>2 px on each side</span>
          </p>
          <div className="rounded border border-dashed border-green/50 p-3 sm:p-4">
            <p className="mb-3 flex flex-wrap justify-between gap-1 text-sm">
              <strong className="font-medium">Padding</strong>
              <span>16 px on each side</span>
            </p>
            <div className="rounded border border-green/40 bg-page px-3 py-6 text-center">
              <p className="text-base font-medium">Content</p>
              <div className="mt-2 flex items-center justify-center gap-2 font-mono text-sm">
                <ArrowLeftRight size={18} aria-hidden="true" />
                200 px wide
              </div>
              <p className="mt-2 text-xs text-muted-ink">content-box example</p>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-ink">
        Schematic, not drawn to scale. Values apply to both horizontal sides.
        Margin is outside either sizing mode.
      </p>
      <pre
        aria-label="CSS box example"
        className="my-4 overflow-x-auto rounded-lg border border-line bg-surface p-3 font-mono text-sm leading-7"
      >
        {"width: 200px;\npadding: 16px;\nborder: 2px solid;\nmargin: 16px;"}
      </pre>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-line p-3">
          <h3 className="font-mono text-sm font-semibold">content-box</h3>
          <p className="mt-2 text-2xl font-medium tabular-nums">
            {content.borderBox} px
          </p>
          <p className="text-sm text-muted-ink">border-box width</p>
          <p className="mt-2 font-mono text-sm">200 + 32 + 4 = 236</p>
          <p className="mt-2 text-sm text-muted-ink">
            With these margins: {content.outer} px
          </p>
        </div>
        <div className="rounded-lg border border-green/40 bg-green-soft p-3">
          <h3 className="font-mono text-sm font-semibold">border-box</h3>
          <p className="mt-2 text-2xl font-medium tabular-nums">
            {border.borderBox} px
          </p>
          <p className="text-sm text-muted-ink">border-box width</p>
          <p className="mt-2 font-mono text-sm">164 + 32 + 4 = 200</p>
          <p className="mt-2 text-sm text-muted-ink">
            With these margins: {border.outer} px
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-ink">
        With <code className="font-mono text-ink">border-box</code>, padding and
        border consume part of the declared width. The content region becomes{" "}
        {border.content} px. The margin is not included.
      </p>
    </figure>
  );
}
