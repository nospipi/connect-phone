// apps/api/src/resources/cms/offer-exclusions/services/get-all/service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllOfferExclusionsService } from './service';
import { OfferExclusionEntity } from '@/database/entities/offer-exclusion.entity';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';
import {
  createMockOrganization,
  createMockOfferExclusion,
  createCurrentOrganizationServiceProvider,
} from '@/test/factories';

//----------------------------------------------------------------------

describe('GetAllOfferExclusionsService', () => {
  let service: GetAllOfferExclusionsService;
  let offerExclusionRepository: jest.Mocked<Repository<OfferExclusionEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockOfferExclusion = createMockOfferExclusion();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllOfferExclusionsService,
        {
          provide: getRepositoryToken(OfferExclusionEntity),
          useValue: {
            find: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<GetAllOfferExclusionsService>(
      GetAllOfferExclusionsService
    );
    offerExclusionRepository = module.get(
      getRepositoryToken(OfferExclusionEntity)
    );
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllOfferExclusions', () => {
    it('should return all offer exclusions for current organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerExclusionRepository.find.mockResolvedValue([
        mockOfferExclusion as any,
      ]);

      const result = await service.getAllOfferExclusions();

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(offerExclusionRepository.find).toHaveBeenCalledWith({
        where: {
          organizationId: 1,
        },
        order: {
          createdAt: 'DESC',
        },
      });
      expect(result).toEqual([mockOfferExclusion]);
    });
  });
});
