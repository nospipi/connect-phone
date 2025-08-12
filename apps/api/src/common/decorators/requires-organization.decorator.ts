// src/decorators/requires-organization.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const REQUIRES_ORGANIZATION_KEY = 'requiresOrganization';
export const RequiresOrganization = () =>
  SetMetadata(REQUIRES_ORGANIZATION_KEY, true);
