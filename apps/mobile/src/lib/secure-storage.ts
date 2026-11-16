import { randomUUID } from "expo-crypto";
import * as SecureStore from "expo-secure-store";
// Session payloads may exceed the native per-item size. Commit chunk metadata last.
export const secureStorage = {
  async getItem(key: string) {
    const manifest = await SecureStore.getItemAsync(key);
    if (!manifest) return null;
    const { count, generation } = JSON.parse(manifest) as {
      count: number;
      generation: string;
    };
    if (!Number.isInteger(count) || count < 1 || count > 128)
      throw new Error("Invalid session storage");
    const parts = await Promise.all(
      Array.from({ length: count }, (_, i) =>
        SecureStore.getItemAsync(`${key}.${generation}.${i}`),
      ),
    );
    if (parts.some((part) => part === null))
      throw new Error("Incomplete session storage");
    return parts.join("");
  },
  async setItem(key: string, value: string) {
    const old = await SecureStore.getItemAsync(key);
    const generation = randomUUID();
    const points = Array.from(value);
    const chunks = Array.from(
      { length: Math.max(1, Math.ceil(points.length / 450)) },
      (_, i) => points.slice(i * 450, (i + 1) * 450).join(""),
    );
    for (let i = 0; i < chunks.length; i++)
      await SecureStore.setItemAsync(`${key}.${generation}.${i}`, chunks[i]);
    await SecureStore.setItemAsync(
      key,
      JSON.stringify({ count: chunks.length, generation }),
    );
    if (old) {
      const previous = JSON.parse(old);
      for (let i = 0; i < previous.count; i++)
        await SecureStore.deleteItemAsync(`${key}.${previous.generation}.${i}`);
    }
  },
  async removeItem(key: string) {
    const old = await SecureStore.getItemAsync(key);
    await SecureStore.deleteItemAsync(key);
    if (old) {
      const previous = JSON.parse(old);
      for (let i = 0; i < previous.count; i++)
        await SecureStore.deleteItemAsync(`${key}.${previous.generation}.${i}`);
    }
  },
};
