import { useEffect, useState } from "react";
import { day } from "@trailbook/learning/mistakes";
export function useNotebookDay() {
  const [today, setToday] = useState(day);
  useEffect(() => {
    const update = () => setToday(day());
    const timer = window.setInterval(update, 30_000);
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return today;
}
