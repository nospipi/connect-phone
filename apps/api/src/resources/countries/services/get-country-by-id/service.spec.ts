// apps/api/src/resources/countries/services/get-country-by-id/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { GetCountryByIdService } from './service';
import { CountryEntity } from '../../../../database/entities/country.entity';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import {
  createMockOrganization,
  createMockCountry,
  createCurrentOrganizationServiceProvider,
} from '../../../../test/factories';

//------------------------------------------------------

describe('GetCountryByIdService', () => {
  let service: GetCountryByIdService;
  let countryRepository: jest.Mocked<Repository<CountryEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockCountry = createMockCountry();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCountryByIdService,
        {
          provide: getRepositoryToken(CountryEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<GetCountryByIdService>(GetCountryByIdService);
    countryRepository = module.get(getRepositoryToken(CountryEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCountryById', () => {
    it('should return country when it exists and belongs to organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.findOne.mockResolvedValue(mockCountry as CountryEntity);

      const result = await service.getCountryById(1);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(countryRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          organizationId: 1,
        },
        relations: ['organization'],
      });
      expect(result).toEqual(mockCountry);
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.getCountryById(1)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );

      expect(countryRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when country does not exist', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.findOne.mockResolvedValue(null);

      await expect(service.getCountryById(999)).rejects.toThrow(
        new NotFoundException(
          'Country with ID 999 not found in current organization'
        )
      );

      expect(countryRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 999,
          organizationId: 1,
        },
        relations: ['organization'],
      });
    });

    it('should throw NotFoundException when country belongs to different organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.findOne.mockResolvedValue(null);

      await expect(service.getCountryById(1)).rejects.toThrow(
        new NotFoundException(
          'Country with ID 1 not found in current organization'
        )
      );

      expect(countryRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          organizationId: 1,
        },
        relations: ['organization'],
      });
    });

    it('should handle different country IDs correctly', async () => {
      const countryId = 999;
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.findOne.mockResolvedValue(mockCountry as CountryEntity);

      await service.getCountryById(countryId);

      expect(countryRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: countryId,
          organizationId: 1,
        },
        relations: ['organization'],
      });
    });

    it('should handle database errors during country lookup', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.findOne.mockRejectedValue(new Error('Database error'));

      await expect(service.getCountryById(1)).rejects.toThrow('Database error');

      expect(countryRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return country with complete relations', async () => {
      const countryWithRelations = {
        ...mockCountry,
        organization: mockOrganization,
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.findOne.mockResolvedValue(
        countryWithRelations as CountryEntity
      );

      const result = await service.getCountryById(1);

      expect(result).toEqual(countryWithRelations);
      expect(result.organization).toEqual(mockOrganization);
    });

    it('should handle countries with different properties', async () => {
      const differentCountry = createMockCountry({
        id: 2,
        name: 'United States',
        code: 'us',
        flagAvatarUrl: 'https://flagcdn.com/56x42/us.webp',
        flagProductImageUrl: 'https://flagcdn.com/192x144/us.webp',
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.findOne.mockResolvedValue(
        differentCountry as CountryEntity
      );

      const result = await service.getCountryById(2);

      expect(result).toEqual(differentCountry);
      expect(result.name).toBe('United States');
      expect(result.code).toBe('us');
    });
  });
});

// apps/api/src/resources/countries/services/get-country-by-id/service.spec.ts
