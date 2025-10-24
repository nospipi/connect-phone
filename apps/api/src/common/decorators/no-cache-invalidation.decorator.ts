// apps/api/src/common/decorators/no-cache-invalidation.decorator.ts

import { SetMetadata } from '@nestjs/common';

//------------------------------------------------------------

export const NO_CACHE_INVALIDATION_KEY = 'noCacheInvalidation';
export const NoCacheInvalidation = () =>
  SetMetadata(NO_CACHE_INVALIDATION_KEY, true);
