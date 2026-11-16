export const secureStorage = {
  getItem: (key: string) =>
    typeof window === "undefined" ? null : window.sessionStorage.getItem(key),
  setItem: (key: string, value: string) => {
    window.sessionStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    window.sessionStorage.removeItem(key);
  },
};
