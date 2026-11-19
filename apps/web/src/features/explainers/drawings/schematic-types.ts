export interface VisualStage {
  label: string;
  value: string;
  items?: string[];
}
export type Schematic =
  | {
      kind: "sequence";
      title: string;
      actors: string[];
      messages: { from: number; to: number; label: string }[];
      note: string;
    }
  | { kind: "flow"; title: string; stages: VisualStage[]; note: string }
  | {
      kind: "fork";
      title: string;
      inputs: VisualStage[];
      hub: VisualStage;
      outputs: VisualStage[];
      note: string;
    }
  | {
      kind: "states";
      title: string;
      root: string;
      branches: { when: string; label: string; value: string }[];
      note: string;
    }
  | { kind: "cycle"; title: string; stages: VisualStage[]; note: string }
  | {
      kind: "security";
      title: string;
      rows: { input: string; gate: string; output: string }[];
      note: string;
    }
  | { kind: "waterfall"; title: string; note: string }
  | {
      kind: "funnel";
      title: string;
      stages: { label: string; count: number }[];
      note: string;
    }
  | {
      kind:
        | "accessibility"
        | "cache"
        | "payloads"
        | "pagination"
        | "tokens"
        | "collections"
        | "complexity"
        | "tool-map"
        | "sql-systems";
      title: string;
      note: string;
    };
