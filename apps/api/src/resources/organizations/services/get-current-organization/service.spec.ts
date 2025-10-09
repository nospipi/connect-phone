// apps/api/src/resources/organizations/services/get-current-organization/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { GetCurrentOrganizationService } from './service';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import {
  createMockOrganization,
  createCurrentOrganizationServiceProvider,
} from '../../../../test/factories';

describe('GetCurrentOrganizationService', () => {
  let service: GetCurrentOrganizationService;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCurrentOrganizationService,
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<GetCurrentOrganizationService>(
      GetCurrentOrganizationService
    );
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCurrentOrganization', () => {
    it('should return current organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );

      const result = await service.getCurrentOrganization();

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockOrganization);
    });

    it('should return null when no organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      const result = await service.getCurrentOrganization();

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });
  });
});
