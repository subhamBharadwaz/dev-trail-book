import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { dateKey } from "@trailbook/learning/preparation";
export function useToday() {
  const [today, setToday] = useState(dateKey);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const update = () => {
      clearTimeout(timer);
      setToday(dateKey());
      const now = new Date();
      const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );
      timer = setTimeout(update, midnight.getTime() - now.getTime() + 100);
    };
    update();
    const listener = AppState.addEventListener("change", (state) => {
      if (state === "active") update();
    });
    return () => {
      clearTimeout(timer);
      listener.remove();
    };
  }, []);
  return today;
}
