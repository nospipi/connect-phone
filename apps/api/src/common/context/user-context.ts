// src/common/context/user-context.ts
import { AsyncLocalStorage } from 'async_hooks';

const userContext = new AsyncLocalStorage<number | null>();

export class UserContext {
  static run<T>(userId: number | null, fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      userContext.run(userId, async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error instanceof Error ? error : new Error(String(error)));
        }
      });
    });
  }

  static getCurrentUserId(): number | null {
    return userContext.getStore() || null;
  }
}
