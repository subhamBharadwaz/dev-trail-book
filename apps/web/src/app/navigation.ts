import { navigate } from "astro:transitions/client";
export function navigateWithinApp(path: string) {
  if (!path.startsWith("/") || path.startsWith("//"))
    throw new Error("Expected a local application path");
  return navigate(path);
}
