// apps/api/src/common/context/organization-context.ts

/**
 * OrganizationContext - Request-scoped Organization ID Storage
 *
 * Provides thread-safe access to the current organization ID throughout the request lifecycle
 * using Node.js AsyncLocalStorage. Enables services, subscribers, and middleware to access
 * organization context without explicit parameter passing.
 *
 * Primary use cases:
 * - Audit logging: Automatically associate database changes with correct organization
 * - Multi-tenant data isolation: Ensure operations are scoped to correct organization
 * - Authorization: Validate operations against current organization membership
 *
 * Usage: Set context once per request, access from anywhere in the call stack
 */

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
