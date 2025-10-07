// apps/api/src/resources/countries/services/get-all-countries-of-org/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllCountriesOfOrgService } from './service';
import { CountryEntity } from '../../../../database/entities/country.entity';
import {
  createMockOrganization,
  createMockCountry,
  createCurrentOrganizationServiceProvider,
} from '../../../../test/factories';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';

//--------------------------------------------------------------------------------

describe('GetAllCountriesOfOrgService', () => {
  let service: GetAllCountriesOfOrgService;
  let countryRepository: jest.Mocked<Repository<CountryEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockCountries = [createMockCountry(), createMockCountry()];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllCountriesOfOrgService,
        {
          provide: getRepositoryToken(CountryEntity),
          useValue: {
            find: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<GetAllCountriesOfOrgService>(
      GetAllCountriesOfOrgService
    );
    countryRepository = module.get(getRepositoryToken(CountryEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCountries', () => {
    it('should return all countries for current organization ordered by name', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.find.mockResolvedValue(
        mockCountries as CountryEntity[]
      );

      const result = await service.getAllCountries();

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(countryRepository.find).toHaveBeenCalledWith({
        where: {
          organizationId: 1,
        },
        order: {
          name: 'ASC',
        },
      });
      expect(result).toEqual(mockCountries);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no countries exist for organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.find.mockResolvedValue([]);

      const result = await service.getAllCountries();

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(countryRepository.find).toHaveBeenCalledWith({
        where: {
          organizationId: 1,
        },
        order: {
          name: 'ASC',
        },
      });
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle different organization IDs correctly', async () => {
      const differentOrg = createMockOrganization({ id: 5 });
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        differentOrg
      );
      countryRepository.find.mockResolvedValue([]);

      await service.getAllCountries();

      expect(countryRepository.find).toHaveBeenCalledWith({
        where: {
          organizationId: 5,
        },
        order: {
          name: 'ASC',
        },
      });
    });

    it('should handle null organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);
      countryRepository.find.mockResolvedValue([]);

      await service.getAllCountries();

      expect(countryRepository.find).toHaveBeenCalledWith({
        where: {
          organizationId: undefined,
        },
        order: {
          name: 'ASC',
        },
      });
    });

    it('should handle database errors', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(service.getAllCountries()).rejects.toThrow('Database error');

      expect(countryRepository.find).toHaveBeenCalledTimes(1);
    });
  });
});

// apps/api/src/resources/countries/services/get-all-countries-of-org/service.spec.ts
