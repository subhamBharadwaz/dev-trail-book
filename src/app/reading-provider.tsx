import type { ReactNode } from "react";
import { useStoredList } from "@/hooks/use-stored-list";
import { ReadingContext } from "./reading-context";
export function ReadingProvider({ children }: { children: ReactNode }) {
  const [saved, toggleSaved] = useStoredList("trailbook:saved");
  const [read, toggleRead] = useStoredList("trailbook:read");
  return (
    <ReadingContext value={{ saved, read, toggleSaved, toggleRead }}>
      {children}
    </ReadingContext>
  );
}
