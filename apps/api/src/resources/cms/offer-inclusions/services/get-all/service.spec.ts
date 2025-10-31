// apps/api/src/resources/cms/offer-inclusions/services/get-all/service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllOfferInclusionsService } from './service';
import { OfferInclusionEntity } from '@/database/entities/offer-inclusion.entity';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';
import {
  createMockOrganization,
  createMockOfferInclusion,
  createCurrentOrganizationServiceProvider,
} from '@/test/factories';

//----------------------------------------------------------------------

describe('GetAllOfferInclusionsService', () => {
  let service: GetAllOfferInclusionsService;
  let offerInclusionRepository: jest.Mocked<Repository<OfferInclusionEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockOfferInclusion = createMockOfferInclusion();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllOfferInclusionsService,
        {
          provide: getRepositoryToken(OfferInclusionEntity),
          useValue: {
            find: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<GetAllOfferInclusionsService>(
      GetAllOfferInclusionsService
    );
    offerInclusionRepository = module.get(
      getRepositoryToken(OfferInclusionEntity)
    );
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllOfferInclusions', () => {
    it('should return all offer inclusions for current organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      offerInclusionRepository.find.mockResolvedValue([
        mockOfferInclusion as any,
      ]);

      const result = await service.getAllOfferInclusions();

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(offerInclusionRepository.find).toHaveBeenCalledWith({
        where: {
          organizationId: 1,
        },
        order: {
          createdAt: 'DESC',
        },
      });
      expect(result).toEqual([mockOfferInclusion]);
    });
  });
});
