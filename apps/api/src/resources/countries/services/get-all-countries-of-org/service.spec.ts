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
  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllCountriesOfOrgService,
        {
          provide: getRepositoryToken(CountryEntity),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
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
      mockQueryBuilder.getMany.mockResolvedValue(mockCountries);

      const result = await service.getAllCountries('', 'all');

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(countryRepository.createQueryBuilder).toHaveBeenCalledWith(
        'country'
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'country.organizationId = :organizationId',
        { organizationId: 1 }
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'country.name',
        'ASC'
      );
      expect(result).toEqual(mockCountries);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no countries exist for organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockQueryBuilder.getMany.mockResolvedValue([]);

      const result = await service.getAllCountries('', 'all');

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'country.organizationId = :organizationId',
        { organizationId: 1 }
      );
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should add search functionality when search term provided', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockQueryBuilder.getMany.mockResolvedValue(mockCountries);

      await service.getAllCountries('greece', 'all');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'country.name ILIKE :search',
        { search: '%greece%' }
      );
    });

    it('should trim search term and handle spaces', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockQueryBuilder.getMany.mockResolvedValue(mockCountries);

      await service.getAllCountries('  united states  ', 'all');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'country.name ILIKE :search',
        { search: '%united states%' }
      );
    });

    it('should not add search when search term is empty or whitespace', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockQueryBuilder.getMany.mockResolvedValue(mockCountries);

      await service.getAllCountries('   ', 'all');

      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        expect.stringContaining('ILIKE'),
        expect.any(Object)
      );
    });

    it('should add region filtering when region is specified', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockQueryBuilder.getMany.mockResolvedValue(mockCountries);

      await service.getAllCountries('', 'europe');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'country.region = :region',
        { region: 'europe' }
      );
    });

    it('should handle region case insensitively', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockQueryBuilder.getMany.mockResolvedValue(mockCountries);

      await service.getAllCountries('', 'AsIa');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'country.region = :region',
        { region: 'asia' }
      );
    });

    it('should not add region filtering when region is "all"', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockQueryBuilder.getMany.mockResolvedValue(mockCountries);

      await service.getAllCountries('', 'all');

      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        'country.region = :region',
        expect.any(Object)
      );
    });

    it('should handle both search and region filters together', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockQueryBuilder.getMany.mockResolvedValue(mockCountries);

      await service.getAllCountries('greece', 'europe');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(2);
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
        1,
        'country.name ILIKE :search',
        { search: '%greece%' }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
        2,
        'country.region = :region',
        { region: 'europe' }
      );
    });

    it('should handle different organization IDs correctly', async () => {
      const differentOrg = createMockOrganization({ id: 5 });
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        differentOrg
      );
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.getAllCountries('', 'all');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'country.organizationId = :organizationId',
        { organizationId: 5 }
      );
    });

    it('should handle null organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.getAllCountries('', 'all');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'country.organizationId = :organizationId',
        { organizationId: undefined }
      );
    });

    it('should handle database errors', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockQueryBuilder.getMany.mockRejectedValue(new Error('Database error'));

      await expect(service.getAllCountries('', 'all')).rejects.toThrow(
        'Database error'
      );

      expect(mockQueryBuilder.getMany).toHaveBeenCalledTimes(1);
    });
  });
});
