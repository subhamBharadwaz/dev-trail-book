import type { SupabaseClient } from "@supabase/supabase-js";
import { afterEach, expect, test, vi } from "vitest";
import { progress } from "./progress-store";
import { createSyncEngine } from "./sync-engine";
let engine: ReturnType<typeof createSyncEngine> | undefined;
afterEach(() => {
  engine?.stop();
  engine = undefined;
  progress.activate(null);
  vi.useRealTimers();
  vi.restoreAllMocks();
});
function backend() {
  const range = vi.fn().mockResolvedValue({ data: [], error: null });
  const rpc = vi.fn().mockImplementation(async (_name, args) => ({
    data: {
      applied: true,
      record: {
        key: args.p_key,
        value: args.p_value,
        revision: args.p_expected_revision + 1,
      },
    },
    error: null,
  }));
  const client = {
    from: () => ({
      select: () => ({ eq: () => ({ order: () => ({ range }) }) }),
    }),
    rpc,
  } as unknown as SupabaseClient;
  return { client, rpc, range };
}
test("pending changes are uploaded once without creating a continuous retry loop", async () => {
  vi.useFakeTimers();
  const api = backend();
  progress.activate("alice");
  progress.write({ "reading/read/closures": true });
  engine = createSyncEngine(api.client, "alice");
  await vi.advanceTimersByTimeAsync(0);
  expect(api.rpc).toHaveBeenCalledTimes(1);
  expect(progress.getSnapshot().pending).toEqual({});
  expect(progress.getSnapshot().phase).toBe("saved");
  await vi.advanceTimersByTimeAsync(3000);
  expect(api.range).toHaveBeenCalledTimes(1);
});
test("offline work remains queued and can be retried after reconnecting", async () => {
  vi.useFakeTimers();
  const online = vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
  const api = backend();
  progress.activate("alice");
  progress.write({ "reading/read/closures": true });
  engine = createSyncEngine(api.client, "alice");
  await vi.advanceTimersByTimeAsync(0);
  expect(progress.getSnapshot().phase).toBe("offline");
  expect(api.rpc).not.toHaveBeenCalled();
  online.mockReturnValue(true);
  await engine.sync();
  expect(api.rpc).toHaveBeenCalledTimes(1);
  expect(progress.getSnapshot().phase).toBe("saved");
});
test("requests completing after an account switch cannot populate the other account", async () => {
  vi.useFakeTimers();
  const api = backend();
  let finish!: (value: unknown) => void;
  api.range.mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  progress.activate("alice");
  engine = createSyncEngine(api.client, "alice");
  progress.activate("bob");
  finish({
    data: [{ key: "reading/read/closures", value: true, revision: 1 }],
    error: null,
  });
  await vi.advanceTimersByTimeAsync(0);
  expect(progress.getSnapshot().userId).toBe("bob");
  expect(progress.values()).toEqual({});
});
