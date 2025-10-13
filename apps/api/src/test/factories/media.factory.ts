// apps/api/src/test/factories/media.factory.ts
import { IMedia } from '@connect-phone/shared-types';
import { createMockOrganization } from './organization.factory';

export function createMockMedia(overrides?: Partial<IMedia>): IMedia {
  return {
    id: 1,
    url: 'https://blob.vercel-storage.com/test.jpg',
    description: 'Test description',
    organizationId: 1,
    organization: createMockOrganization(),
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    ...overrides,
  } as IMedia;
}
