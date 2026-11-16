import { useSyncExternalStore } from "react";
import { resolveRoute } from "@/app/routes";
function subscribe(onChange: () => void) {
  const change = () => {
    onChange();
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  window.addEventListener("hashchange", change);
  return () => window.removeEventListener("hashchange", change);
}
const getSnapshot = () => window.location.hash.slice(1) || "/";
export function useRoute() {
  return resolveRoute(useSyncExternalStore(subscribe, getSnapshot, () => "/"));
}
