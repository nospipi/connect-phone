// src/common/context/organization-context.ts
import { AsyncLocalStorage } from 'async_hooks';

const organizationContext = new AsyncLocalStorage<number | null>();

export class OrganizationContext {
  static run<T>(
    organizationId: number | null,
    fn: () => Promise<T>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      organizationContext.run(organizationId, async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error instanceof Error ? error : new Error(String(error)));
        }
      });
    });
  }

  static getCurrentOrganizationId(): number | null {
    return organizationContext.getStore() || null;
  }
}
