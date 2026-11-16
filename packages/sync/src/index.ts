export type Json =
  null | boolean | number | string | Json[] | { [key: string]: Json };
export interface RemoteRecord {
  key: string;
  value: Json;
  revision: number;
}
export interface Pending {
  value: Json;
  base: number;
  nonce: string;
}
export interface ProgressSnapshot {
  userId: string | null;
  records: Record<string, RemoteRecord>;
  pending: Record<string, Pending>;
  conflicts: Record<string, RemoteRecord>;
  phase: "guest" | "loading" | "syncing" | "saved" | "offline" | "error";
  error: string;
  storageError: boolean;
  lastSynced: string | null;
}
export interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export function createProgressStore(storage: Storage, nonce: () => string) {
  const listeners = new Set<() => void>();
  let snapshot: ProgressSnapshot = {
    userId: null,
    records: {},
    pending: {},
    conflicts: {},
    phase: "guest",
    error: "",
    storageError: false,
    lastSynced: null,
  };
  const cacheKey = (id: string) => `trailbook:cloud:${id}:v1`;
  const progress = {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    publish(patch: Partial<ProgressSnapshot>) {
      snapshot = { ...snapshot, ...patch };
      if (snapshot.userId) {
        try {
          storage.setItem(
            cacheKey(snapshot.userId),
            JSON.stringify({
              records: snapshot.records,
              pending: snapshot.pending,
              conflicts: snapshot.conflicts,
            }),
          );
        } catch {
          snapshot = { ...snapshot, storageError: true };
        }
      }
      listeners.forEach((listener) => listener());
    },
    activate(userId: string | null) {
      if (snapshot.userId === userId) return;
      let records: ProgressSnapshot["records"] = {},
        pending: ProgressSnapshot["pending"] = {},
        conflicts: ProgressSnapshot["conflicts"] = {};
      if (userId)
        try {
          const cache = JSON.parse(storage.getItem(cacheKey(userId)) || "null");
          if (
            cache &&
            typeof cache.records === "object" &&
            !Array.isArray(cache.records) &&
            cache.records &&
            typeof cache.pending === "object" &&
            cache.pending
          ) {
            for (const [key, record] of Object.entries(cache.records)) {
              const value = record as RemoteRecord;
              if (
                value?.key === key &&
                Number.isSafeInteger(value.revision) &&
                value.revision > 0
              )
                records[key] = value;
            }
            for (const [key, change] of Object.entries(cache.pending)) {
              const value = change as Pending;
              if (
                value &&
                Number.isSafeInteger(value.base) &&
                value.base >= 0 &&
                typeof value.nonce === "string" &&
                Object.hasOwn(value, "value")
              )
                pending[key] = value;
            }
            if (cache.conflicts && typeof cache.conflicts === "object")
              for (const [key, record] of Object.entries(cache.conflicts)) {
                const value = record as RemoteRecord;
                if (
                  pending[key] &&
                  value?.key === key &&
                  Number.isSafeInteger(value.revision)
                )
                  conflicts[key] = value;
              }
          }
        } catch {
          /* A damaged cache is recovered from the server after sign-in. */
        }
      snapshot = {
        userId,
        records,
        pending,
        conflicts,
        phase: userId ? "loading" : "guest",
        error: "",
        storageError: false,
        lastSynced: null,
      };
      listeners.forEach((listener) => listener());
    },
    values() {
      const values: Record<string, Json> = {};
      for (const [key, record] of Object.entries(snapshot.records))
        values[key] = record.value;
      for (const [key, change] of Object.entries(snapshot.pending))
        values[key] = change.value;
      return values;
    },
    write(changes: Record<string, Json>) {
      if (!snapshot.userId)
        throw new Error("Sign in before saving account progress.");
      const values = progress.values(),
        pending = { ...snapshot.pending };
      for (const [key, value] of Object.entries(changes)) {
        if (JSON.stringify(values[key]) !== JSON.stringify(value))
          pending[key] = {
            value,
            base: pending[key]?.base ?? snapshot.records[key]?.revision ?? 0,
            nonce: nonce(),
          };
      }
      if (
        Object.keys(pending).every(
          (key) => pending[key] === snapshot.pending[key],
        ) &&
        Object.keys(pending).length === Object.keys(snapshot.pending).length
      )
        return;
      progress.publish({ pending, phase: "syncing", error: "" });
    },
    receive(records: RemoteRecord[]) {
      const merged = { ...snapshot.records },
        pending = { ...snapshot.pending },
        conflicts = { ...snapshot.conflicts };
      for (const record of records) {
        if ((merged[record.key]?.revision || 0) > record.revision) continue;
        merged[record.key] = record;
        const change = pending[record.key];
        if (change && record.revision > change.base) {
          if (JSON.stringify(change.value) === JSON.stringify(record.value)) {
            delete pending[record.key];
            delete conflicts[record.key];
          } else conflicts[record.key] = record;
        }
      }
      progress.publish({ records: merged, pending, conflicts });
    },
    acknowledge(key: string, sent: Pending, record: RemoteRecord) {
      const pending = { ...snapshot.pending },
        conflicts = { ...snapshot.conflicts };
      if (pending[key]?.nonce === sent.nonce) delete pending[key];
      else if (pending[key])
        pending[key] = { ...pending[key], base: record.revision };
      delete conflicts[key];
      progress.publish({
        records: { ...snapshot.records, [key]: record },
        pending,
        conflicts,
      });
    },
    resolve(key: string, choice: "local" | "cloud") {
      const record = snapshot.conflicts[key];
      if (!record) return;
      const pending = { ...snapshot.pending },
        conflicts = { ...snapshot.conflicts };
      if (choice === "cloud") delete pending[key];
      else
        pending[key] = {
          ...pending[key],
          base: record.revision,
          nonce: nonce(),
        };
      delete conflicts[key];
      progress.publish({
        records: { ...snapshot.records, [key]: record },
        pending,
        conflicts,
        phase: "syncing",
      });
    },
  };

  return progress;
}
export type ProgressStore = ReturnType<typeof createProgressStore>;
