import { useSyncExternalStore } from "react";
import { resolveRoute } from "@/app/routes";
function subscribe(onChange: () => void) {
  const change = () => {
    onChange();
  };
  window.addEventListener("hashchange", change);
  window.addEventListener("popstate", change);
  document.addEventListener("astro:page-load", change);
  return () => {
    window.removeEventListener("hashchange", change);
    window.removeEventListener("popstate", change);
    document.removeEventListener("astro:page-load", change);
  };
}
const getSnapshot = () =>
  window.location.hash.startsWith("#/")
    ? window.location.hash.slice(1)
    : window.location.pathname.replace(/\/$/, "") || "/";
export function useRoute(initialPath = "/") {
  return resolveRoute(
    useSyncExternalStore(subscribe, getSnapshot, () => initialPath),
  );
}
