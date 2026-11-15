import { useSyncExternalStore } from "react";
import {
  emptyPreparation,
  parsePreparation,
  type Preparation,
} from "../data/preparation";
const key = "trailbook:preparation:v1";
const changed = "trailbook:preparation-changed";
let memory: Preparation | null = null;
let cachedRaw: string | null | undefined;
let snapshot = { state: emptyPreparation, storageError: false };
function getSnapshot() {
  if (memory) return snapshot;
  try {
    const raw = localStorage.getItem(key);
    if (raw !== cachedRaw || snapshot.storageError) {
      cachedRaw = raw;
      snapshot = { state: parsePreparation(raw), storageError: false };
    }
  } catch {
    if (!snapshot.storageError) snapshot = { ...snapshot, storageError: true };
  }
  return snapshot;
}
function subscribe(notify: () => void) {
  const refresh = (event: Event) => {
    if (
      event instanceof StorageEvent &&
      event.key !== null &&
      event.key !== key
    )
      return;
    if (event instanceof StorageEvent) {
      memory = null;
      cachedRaw = undefined;
    }
    notify();
  };
  window.addEventListener("storage", refresh);
  window.addEventListener(changed, refresh);
  return () => {
    window.removeEventListener("storage", refresh);
    window.removeEventListener(changed, refresh);
  };
}
function update(change: (current: Preparation) => Preparation) {
  const state = change(getSnapshot().state);
  const raw = JSON.stringify(state);
  try {
    localStorage.setItem(key, raw);
    memory = null;
    cachedRaw = raw;
    snapshot = { state, storageError: false };
  } catch {
    memory = state;
    snapshot = { state, storageError: true };
  }
  window.dispatchEvent(new Event(changed));
}
export function usePreparation() {
  return { ...useSyncExternalStore(subscribe, getSnapshot), update };
}
