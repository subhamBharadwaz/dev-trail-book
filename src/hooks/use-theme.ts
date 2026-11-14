import { useEffect, useState } from "react";
export function useTheme() {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("trailbook:theme") === "dark";
    } catch {
      return false;
    }
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("trailbook:theme", dark ? "dark" : "light");
    } catch {
      /* The theme remains usable when browser storage is blocked. */
    }
  }, [dark]);
  return { dark, setDark };
}
