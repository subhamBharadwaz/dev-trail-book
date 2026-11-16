import { expect, test } from "bun:test";
import { createProgressStore, type RemoteRecord } from "./index";
function device() {
  const cache = new Map<string, string>();
  let nonce = 0;
  const storage = {
    getItem: (key: string) => cache.get(key) ?? null,
    setItem: (key: string, value: string) => {
      cache.set(key, value);
    },
  };
  return {
    storage,
    store: createProgressStore(storage, () => String(++nonce)),
  };
}
test("a second device receives saved web-compatible records without mixing guest or other-account data", () => {
  const a = device(),
    b = device();
  a.store.activate("guest");
  a.store.write({ "reading/read/closures": true });
  a.store.activate("alice");
  expect(a.store.values()).toEqual({});
  const saved: RemoteRecord = {
    key: "reading/read/effects",
    value: true,
    revision: 1,
  };
  a.store.receive([saved]);
  b.store.activate("alice");
  b.store.receive([saved]);
  expect(b.store.values()).toEqual(a.store.values());
  b.store.activate("bob");
  expect(b.store.values()).toEqual({});
  a.store.activate("guest");
  expect(a.store.values()["reading/read/closures"]).toBe(true);
});
test("an offline edit survives an app restart and remains pending until acknowledged", () => {
  const a = device();
  a.store.activate("alice");
  a.store.write({ "reading/saved/event-loop": true });
  const restarted = createProgressStore(a.storage, () => "restarted");
  restarted.activate("alice");
  expect(restarted.values()["reading/saved/event-loop"]).toBe(true);
  const sent = restarted.getSnapshot().pending["reading/saved/event-loop"];
  expect(sent.base).toBe(0);
  restarted.acknowledge("reading/saved/event-loop", sent, {
    key: "reading/saved/event-loop",
    value: true,
    revision: 1,
  });
  expect(restarted.getSnapshot().pending).toEqual({});
});
test("a concurrent practice edit requires a choice and retains an edit made while a save is in flight", () => {
  const { store } = device();
  store.activate("alice");
  store.receive([{ key: "practice/session/all:quiz", value: 1, revision: 1 }]);
  store.write({ "practice/session/all:quiz": 2 });
  const sent = store.getSnapshot().pending["practice/session/all:quiz"];
  store.write({ "practice/session/all:quiz": 3 });
  store.acknowledge("practice/session/all:quiz", sent, {
    key: "practice/session/all:quiz",
    value: 2,
    revision: 2,
  });
  expect(store.values()["practice/session/all:quiz"]).toBe(3);
  expect(store.getSnapshot().pending["practice/session/all:quiz"].base).toBe(2);
  store.receive([{ key: "practice/session/all:quiz", value: 4, revision: 3 }]);
  expect(store.getSnapshot().conflicts["practice/session/all:quiz"].value).toBe(
    4,
  );
  store.resolve("practice/session/all:quiz", "cloud");
  expect(store.values()["practice/session/all:quiz"]).toBe(4);
  expect(store.getSnapshot().pending).toEqual({});
});
