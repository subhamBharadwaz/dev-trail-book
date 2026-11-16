import { useContext } from "react";
import { ReadingContext } from "@/app/reading-context";
export function useReadingState() {
  const state = useContext(ReadingContext);
  if (!state) throw new Error("useReadingState requires ReadingProvider");
  return state;
}
