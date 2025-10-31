// apps/api/src/common/context/user-context.ts

/**
 * UserContext - Request-scoped User ID Storage
 *
 * Provides thread-safe access to the current user ID throughout the request lifecycle
 * using Node.js AsyncLocalStorage. Enables services, subscribers, and middleware to access
 * user context without explicit parameter passing.
 *
 * Primary use cases:
 * - Audit logging: Automatically associate database changes with acting user
 * - Authorization: Validate operations against current user permissions
 * - Activity tracking: Log user actions across service boundaries
 *
 * Usage: Set context once per request, access from anywhere in the call stack
 */

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
