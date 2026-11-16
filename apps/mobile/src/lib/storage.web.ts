const memory = new Map<string, string>();
export const storage = {
  getItem: (key: string) =>
    typeof window === "undefined"
      ? (memory.get(key) ?? null)
      : window.localStorage.getItem(key),
  setItem: (key: string, value: string) => {
    if (typeof window === "undefined") memory.set(key, value);
    else window.localStorage.setItem(key, value);
  },
};
