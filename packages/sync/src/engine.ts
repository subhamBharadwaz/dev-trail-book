import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProgressStore, RemoteRecord } from "./index";
export interface SyncEnvironment {
  online(): boolean;
  subscribe(sync: () => void): () => void;
}
export function createRecordSync(
  client: SupabaseClient,
  userId: string,
  progress: ProgressStore,
  environment: SyncEnvironment,
) {
  let stopped = false,
    running = false,
    rerun = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const active = () => !stopped && progress.getSnapshot().userId === userId;
  async function sync() {
    if (!active()) return;
    if (running) {
      rerun = true;
      return;
    }
    if (!environment.online()) {
      progress.publish({
        phase: "offline",
        error:
          "Offline. Changes are saved on this device and will retry when you reconnect.",
      });
      return;
    }
    running = true;
    progress.publish({ phase: "syncing", error: "" });
    try {
      const remote: RemoteRecord[] = [];
      for (let offset = 0; ; offset += 500) {
        const { data, error } = await client
          .from("trailbook_records")
          .select("key,value,revision")
          .eq("user_id", userId)
          .order("key")
          .range(offset, offset + 499);
        if (error) throw error;
        remote.push(...(data as RemoteRecord[]));
        if ((data || []).length < 500) break;
      }
      if (!active()) return;
      progress.receive(remote);
      for (const [key, change] of Object.entries(
        progress.getSnapshot().pending,
      )) {
        if (!active()) return;
        if (progress.getSnapshot().conflicts[key]) continue;
        const { data, error } = await client.rpc("trailbook_write_record", {
          p_key: key,
          p_value: change.value,
          p_expected_revision: change.base,
        });
        if (error) throw error;
        if (!active()) return;
        const result = data as { applied: boolean; record: RemoteRecord };
        if (result.applied) progress.acknowledge(key, change, result.record);
        else progress.receive([result.record]);
      }
      if (active())
        progress.publish({
          phase: "saved",
          lastSynced: new Date().toISOString(),
          error: "",
        });
    } catch {
      if (active())
        progress.publish({
          phase: environment.online() ? "error" : "offline",
          error:
            "Could not sync. Your changes remain on this device. Check your connection and retry; if needed, sign in again.",
        });
    } finally {
      running = false;
      if (rerun && active()) {
        rerun = false;
        timer = setTimeout(() => void sync(), 500);
      }
    }
  }
  const signature = () =>
    Object.entries(progress.getSnapshot().pending)
      .map(([key, value]) => `${key}:${value.nonce}`)
      .join("|");
  let pendingRef = signature();
  const unsubscribe = progress.subscribe(() => {
    const next = signature();
    if (pendingRef !== next) {
      pendingRef = next;
      if (
        !Object.keys(progress.getSnapshot().pending).some(
          (key) => !progress.getSnapshot().conflicts[key],
        )
      )
        return;
      if (running) rerun = true;
      else {
        clearTimeout(timer);
        timer = setTimeout(() => void sync(), 500);
      }
    }
  });
  const unsubscribeEnvironment = environment.subscribe(() => void sync());
  void sync();
  return {
    sync,
    stop() {
      stopped = true;
      clearTimeout(timer);
      unsubscribe();
      unsubscribeEnvironment();
    },
  };
}
