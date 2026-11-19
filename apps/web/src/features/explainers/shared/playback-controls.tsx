import { Button } from "@ui-sdk/react/button";
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw } from "lucide-react";
import type { Playback } from "./use-playback";
export const visualButton =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg border border-line bg-page px-3 text-sm font-medium text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green disabled:cursor-not-allowed disabled:opacity-40";
export function PlaybackControls({
  playback,
  total,
  title,
}: {
  playback: Playback;
  total: number;
  title: string;
}) {
  return (
    <div className="sticky top-16 z-10 flex flex-wrap items-center gap-2 border-y border-line bg-surface px-4 py-3 sm:px-6">
      <p className="w-full text-sm text-muted-ink">
        Step {playback.cursor + 1}/{total} ·{" "}
        <span className="font-medium text-ink">{title}</span>
      </p>
      <Button
        className={visualButton}
        aria-label="Previous visual step"
        disabled={playback.cursor === 0}
        onClick={(event) => playback.advance(-1, event.detail > 0)}
      >
        <ArrowLeft size={15} aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">Back</span>
      </Button>
      <Button
        className={`${visualButton} flex-1 border-green bg-green-soft text-green sm:flex-none`}
        aria-label="Next visual step"
        disabled={playback.last}
        onClick={(event) => playback.advance(1, event.detail > 0)}
      >
        Next step
        <ArrowRight size={15} aria-hidden="true" />
      </Button>
      <Button
        className={visualButton}
        aria-label={
          playback.playing ? "Pause visual playback" : "Play visual walkthrough"
        }
        onClick={playback.toggle}
      >
        {playback.playing ? (
          <Pause size={15} aria-hidden="true" />
        ) : (
          <Play size={15} aria-hidden="true" />
        )}
        <span className="sr-only sm:not-sr-only">
          {playback.playing ? "Pause" : playback.last ? "Replay" : "Play"}
        </span>
      </Button>
      <Button
        className={`${visualButton} sm:ml-auto`}
        aria-label="Reset visual walkthrough"
        disabled={playback.cursor === 0 && !playback.playing}
        onClick={playback.reset}
      >
        <RotateCcw size={15} aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">Reset</span>
      </Button>
    </div>
  );
}
