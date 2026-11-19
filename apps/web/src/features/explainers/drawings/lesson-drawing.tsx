import { SchematicDrawing } from "./schematic";
import type { Schematic } from "./schematic-types";
import { ServerBoundaryDrawing } from "./server-boundary";
import { BoxModelDrawing } from "./box-model";
import { SqlRelationshipDrawing } from "./sql-relationship";
export type DrawingKind =
  "server-boundary" | "box-model" | "sql-relationship" | Schematic;
export function LessonDrawing({ kind }: { kind: DrawingKind }) {
  if (typeof kind === "object") return <SchematicDrawing spec={kind} />;
  switch (kind) {
    case "server-boundary":
      return <ServerBoundaryDrawing />;
    case "box-model":
      return <BoxModelDrawing />;
    case "sql-relationship":
      return <SqlRelationshipDrawing />;
  }
}
