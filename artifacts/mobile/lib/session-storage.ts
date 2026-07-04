import type * as SecureStore from "expo-secure-store";
import type { SessionStorageAdapter } from "@workspace/shared/auth";

interface AsyncStorageLike {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

interface SecureStoreLike {
  getItemAsync?: (key: string) => Promise<string | null>;
  setItemAsync?: (key: string, value: string, options?: unknown) => Promise<void>;
  deleteItemAsync?: (key: string) => Promise<void>;
  WHEN_UNLOCKED_THIS_DEVICE_ONLY?: string | number;
}

interface SessionStorageAdapterOptions {
  asyncStorage?: AsyncStorageLike;
  secureStore?: SecureStoreLike;
  isWeb?: boolean;
}

/**
 * Session storage adapter that prefers SecureStore on native platforms and
 * falls back to AsyncStorage in web or when SecureStore is unavailable.
 */

const TOKEN_KEY = "accessToken";
const MIGRATED_FLAG = "__secure_migrated_v1";
const LEGACY_KEYS = ["accessToken", "refreshToken", "user"] as const;

async function getAsyncStorage(): Promise<AsyncStorageLike> {
  try {
    const mod = await import("@react-native-async-storage/async-storage");
    return mod.default as AsyncStorageLike;
  } catch {
    return {
      async getItem() {
        return null;
      },
      async setItem() {},
      async removeItem() {},
    };
  }
}

async function getSecureStore(): Promise<SecureStoreLike | null> {
  try {
    const mod = (await import("expo-secure-store")) as unknown as
      | Partial<SecureStoreLike>
      | { default?: Partial<SecureStoreLike> };
    const candidate = "default" in mod && mod.default ? mod.default : mod;
    return candidate as SecureStoreLike;
  } catch {
    return null;
  }
}

function isWebRuntime(explicit?: boolean) {
  return explicit ?? (typeof window !== "undefined" && typeof document !== "undefined");
}

export function createSessionStorageAdapter(
  options: SessionStorageAdapterOptions = {},
): SessionStorageAdapter {
  let migrationPromise: Promise<void> | null = null;
  const asyncStorage = options.asyncStorage ?? null;
  const secureStore = options.secureStore ?? null;
  const webRuntime = isWebRuntime(options.isWeb);

  async function migrateOnce(): Promise<void> {
    if (migrationPromise) {
      return migrationPromise;
    }

    migrationPromise = (async () => {
      const storage = asyncStorage ?? (await getAsyncStorage());
      const secure = webRuntime
        ? null
        : (secureStore ?? (await getSecureStore()));

      if (webRuntime || !secure?.setItemAsync || !secure?.deleteItemAsync) {
        return;
      }

      try {
        const done = await storage.getItem(MIGRATED_FLAG);
        if (done) return;
        for (const k of LEGACY_KEYS) {
          const v = await storage.getItem(k);
          if (v != null) {
            await secure.setItemAsync(k, v, {
              keychainAccessible: secure.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
            });
            await storage.removeItem(k);
          }
        }
        await storage.setItem(MIGRATED_FLAG, "1");
      } catch {
        // Migration is best-effort; never let it block auth.
      }
    })();

    return migrationPromise;
  }

  return {
    async getToken() {
      const storage = asyncStorage ?? (await getAsyncStorage());
      const secure = webRuntime
        ? null
        : (secureStore ?? (await getSecureStore()));

      if (webRuntime || !secure?.getItemAsync) {
        return storage.getItem(TOKEN_KEY);
      }

      await migrateOnce();
      try {
        return await secure.getItemAsync(TOKEN_KEY);
      } catch {
        return storage.getItem(TOKEN_KEY);
      }
    },
    async setToken(token) {
      const storage = asyncStorage ?? (await getAsyncStorage());
      const secure = webRuntime
        ? null
        : (secureStore ?? (await getSecureStore()));

      if (token == null) {
        if (secure?.deleteItemAsync) {
          await secure.deleteItemAsync(TOKEN_KEY);
        }
        await storage.removeItem(TOKEN_KEY);
        return;
      }

      if (webRuntime || !secure?.setItemAsync) {
        await storage.setItem(TOKEN_KEY, token);
        return;
      }

      await secure.setItemAsync(TOKEN_KEY, token, {
        keychainAccessible: secure.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
    },
    async clear() {
      const storage = asyncStorage ?? (await getAsyncStorage());
      const secure = webRuntime
        ? null
        : (secureStore ?? (await getSecureStore()));

      if (secure?.deleteItemAsync) {
        await secure.deleteItemAsync(TOKEN_KEY);
      }
      await storage.removeItem(TOKEN_KEY);
    },
  };
}

export const secureSessionAdapter: SessionStorageAdapter =
  createSessionStorageAdapter();
