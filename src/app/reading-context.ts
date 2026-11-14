import { createContext } from "react";
export interface ReadingState {
  saved: string[];
  read: string[];
  toggleSaved: (slug: string) => void;
  toggleRead: (slug: string) => void;
}
export const ReadingContext = createContext<ReadingState | null>(null);
