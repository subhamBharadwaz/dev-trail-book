import type { DrawingKind } from "./drawings/lesson-drawing";
export interface Token {
  id: string;
  label: string;
}
export interface VisualPanel {
  id: string;
  label: string;
  hint?: string;
  tokens: Token[];
}
export interface Cell {
  id: string;
  value: string;
  markers?: string[];
  muted?: boolean;
}
export interface VisualStep {
  title: string;
  detail: string;
  line?: number;
  panels: VisualPanel[];
  cells?: Cell[];
  tree?: { values: string[]; active: number[]; visited?: number[] };
  result?: string;
}
export interface Scenario {
  id: string;
  label: string;
  code: string[];
  steps: VisualStep[];
}
export interface Walkthrough {
  drawing?: DrawingKind;
  kind: "walkthrough";
  title: string;
  intro: string;
  scenarios: Scenario[];
  takeaway: string;
  source?: string;
}
export interface Diagram {
  drawing: DrawingKind;
  kind: "diagram";
  title: string;
  intro: string;
  example: { input: string; output: string; explanation: string };
  takeaway: string;
}
export type LessonVisual = Walkthrough | Diagram;
export type VisualCatalog = Record<string, LessonVisual>;
export function panel(
  id: string,
  label: string,
  entries: string[],
  hint?: string,
): VisualPanel {
  return {
    id,
    label,
    hint,
    tokens: entries.map((entry, index) => ({
      id: `${id}-${index}-${entry}`,
      label: entry,
    })),
  };
}
export function scene(
  title: string,
  detail: string,
  panels: VisualPanel[],
  line?: number,
  result?: string,
): VisualStep {
  return { title, detail, panels, line, result };
}
