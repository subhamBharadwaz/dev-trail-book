import type { SupabaseClient } from "@supabase/supabase-js";
import { createRecordSync } from "@trailbook/sync/engine";
import { progress } from "./progress-store";
export function createSyncEngine(client: SupabaseClient, userId: string) {
  return createRecordSync(client, userId, progress, {
    online: () => navigator.onLine,
    subscribe(sync) {
      const focus = () => {
        if (document.visibilityState === "visible") sync();
      };
      window.addEventListener("online", sync);
      window.addEventListener("focus", focus);
      document.addEventListener("visibilitychange", focus);
      const interval = setInterval(focus, 60000);
      return () => {
        clearInterval(interval);
        window.removeEventListener("online", sync);
        window.removeEventListener("focus", focus);
        document.removeEventListener("visibilitychange", focus);
      };
    },
  });
}
