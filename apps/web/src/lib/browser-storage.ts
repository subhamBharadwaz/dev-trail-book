import type { Storage } from "@trailbook/sync";
export const browserStorage: Storage = {
  getItem(key) {
    return typeof window === "undefined"
      ? null
      : window.localStorage.getItem(key);
  },
  setItem(key, value) {
    if (typeof window !== "undefined") window.localStorage.setItem(key, value);
  },
};
