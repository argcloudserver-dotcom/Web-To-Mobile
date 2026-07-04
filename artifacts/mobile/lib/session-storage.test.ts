import assert from "node:assert/strict";
import test from "node:test";

import { createSessionStorageAdapter } from "./session-storage";

test("falls back to async storage when secure storage is unavailable", async () => {
  const values = new Map<string, string>();

  const adapter = createSessionStorageAdapter({
    isWeb: true,
    secureStore: {},
    asyncStorage: {
      async getItem(key: string) {
        return values.get(key) ?? null;
      },
      async setItem(key: string, value: string) {
        values.set(key, value);
      },
      async removeItem(key: string) {
        values.delete(key);
      },
    },
  });

  await adapter.setToken("token-123");
  assert.equal(await adapter.getToken(), "token-123");

  await adapter.clear();
  assert.equal(await adapter.getToken(), null);
});
