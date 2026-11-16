import type { PropsWithChildren } from "react";
import { UpdateContext } from "./updates-context";
export { useAppUpdates } from "./updates-context";
export function AppUpdatesProvider({ children }: PropsWithChildren) {
  return (
    <UpdateContext
      value={{
        supported: false,
        pending: false,
        busy: false,
        message:
          "App updates are available in the installed Android app. The website updates when you refresh.",
        error: "",
        async check() {},
        async apply() {},
      }}
    >
      {children}
    </UpdateContext>
  );
}
