// src/common/decorators/requires-organization.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const REQUIRES_ORGANIZATION_KEY = 'requiresOrganization';

/**
 * Decorator to mark routes that require an organization.
 * When used with OrganizationRequiredGuard, it will ensure
 * the current user has access to an organization before allowing access.
 *
 * Usage:
 * @Controller('sales-channels')
 * export class SalesChannelsController {
 *   @Get()
 *   @RequiresOrganization()
 *   async findAll(@CurrentOrganization() org: Organization) {
 *     // This route requires an organization
 *     // org will always be a valid Organization object
 *   }
 *
 *   @Get('public')
 *   async getPublicData() {
 *     // This route doesn't require organization
 *   }
 * }
 */
export const RequiresOrganization = () =>
  SetMetadata(REQUIRES_ORGANIZATION_KEY, true);
