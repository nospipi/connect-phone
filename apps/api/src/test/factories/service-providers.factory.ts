// apps/api/src/test/factories/service-providers.factory.ts

import { getRepositoryToken } from '@nestjs/typeorm';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';
import { CurrentDbUserService } from '@/common/services/current-db-user.service';

export function createMockRepositoryProvider<T>(entity: any) {
  return {
    provide: getRepositoryToken(entity),
    useValue: {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    },
  };
}

export function createCurrentOrganizationServiceProvider() {
  return {
    provide: CurrentOrganizationService,
    useValue: {
      getCurrentOrganization: jest.fn(),
    },
  };
}

export function createCurrentDbUserServiceProvider() {
  return {
    provide: CurrentDbUserService,
    useValue: {
      getCurrentDbUser: jest.fn(),
    },
  };
}
