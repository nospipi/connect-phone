// apps/api/src/resources/countries/services/get-by-ids/service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { GetCountriesByIdsService } from './service';
import { CountryEntity } from '../../../../database/entities/country.entity';
import { CurrentOrganizationService } from '../../../../common/services/current-organization.service';
import {
  createMockOrganization,
  createMockCountry,
  createCurrentOrganizationServiceProvider,
} from '../../../../test/factories';

//------------------------------------------------------------

describe('GetCountriesByIdsService', () => {
  let service: GetCountriesByIdsService;
  let countryRepository: jest.Mocked<Repository<CountryEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockCountries = [
    createMockCountry({ id: 1, name: 'Greece' }),
    createMockCountry({ id: 2, name: 'Germany' }),
    createMockCountry({ id: 3, name: 'France' }),
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCountriesByIdsService,
        {
          provide: getRepositoryToken(CountryEntity),
          useValue: {
            find: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<GetCountriesByIdsService>(GetCountriesByIdsService);
    countryRepository = module.get(getRepositoryToken(CountryEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCountriesByIds', () => {
    it('should return countries matching provided IDs', async () => {
      const ids = [1, 2, 3];
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.find.mockResolvedValue(
        mockCountries as CountryEntity[]
      );

      const result = await service.getCountriesByIds(ids);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(countryRepository.find).toHaveBeenCalledWith({
        where: {
          id: In(ids),
          organizationId: 1,
        },
        order: {
          name: 'ASC',
        },
      });
      expect(result).toEqual(mockCountries);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no IDs are provided', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.find.mockResolvedValue([]);

      const result = await service.getCountriesByIds([]);

      expect(countryRepository.find).toHaveBeenCalledWith({
        where: {
          id: In([]),
          organizationId: 1,
        },
        order: {
          name: 'ASC',
        },
      });
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return empty array when no countries match provided IDs', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.find.mockResolvedValue([]);

      const result = await service.getCountriesByIds([999, 998, 997]);

      expect(countryRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return only countries that exist and belong to organization', async () => {
      const ids = [1, 2, 999];
      const partialResults = [mockCountries[0], mockCountries[1]];

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.find.mockResolvedValue(
        partialResults as CountryEntity[]
      );

      const result = await service.getCountriesByIds(ids);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });

    it('should return countries ordered by name', async () => {
      const ids = [3, 1, 2];
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.find.mockResolvedValue(
        mockCountries as CountryEntity[]
      );

      const result = await service.getCountriesByIds(ids);

      expect(countryRepository.find).toHaveBeenCalledWith({
        where: {
          id: In(ids),
          organizationId: 1,
        },
        order: {
          name: 'ASC',
        },
      });
      expect(result[0].name).toBe('Greece');
      expect(result[1].name).toBe('Germany');
      expect(result[2].name).toBe('France');
    });

    it('should handle single ID in array', async () => {
      const ids = [1];
      const singleCountry = [mockCountries[0]];

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.find.mockResolvedValue(
        singleCountry as CountryEntity[]
      );

      const result = await service.getCountriesByIds(ids);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('should handle duplicate IDs by returning unique countries', async () => {
      const ids = [1, 1, 2, 2];
      const uniqueCountries = [mockCountries[0], mockCountries[1]];

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.find.mockResolvedValue(
        uniqueCountries as CountryEntity[]
      );

      const result = await service.getCountriesByIds(ids);

      expect(result).toHaveLength(2);
    });

    it('should filter countries by current organization', async () => {
      const ids = [1, 2];
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.find.mockResolvedValue([]);

      await service.getCountriesByIds(ids);

      expect(countryRepository.find).toHaveBeenCalledWith({
        where: {
          id: In(ids),
          organizationId: 1,
        },
        order: {
          name: 'ASC',
        },
      });
    });

    it('should handle different organization IDs correctly', async () => {
      const ids = [1, 2];
      const differentOrg = createMockOrganization({ id: 5 });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        differentOrg
      );
      countryRepository.find.mockResolvedValue([]);

      await service.getCountriesByIds(ids);

      expect(countryRepository.find).toHaveBeenCalledWith({
        where: {
          id: In(ids),
          organizationId: 5,
        },
        order: {
          name: 'ASC',
        },
      });
    });

    it('should handle null organization', async () => {
      const ids = [1, 2];
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);
      countryRepository.find.mockResolvedValue([]);

      await service.getCountriesByIds(ids);

      expect(countryRepository.find).toHaveBeenCalledWith({
        where: {
          id: In(ids),
          organizationId: undefined,
        },
        order: {
          name: 'ASC',
        },
      });
    });

    it('should handle database errors', async () => {
      const ids = [1, 2];
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(service.getCountriesByIds(ids)).rejects.toThrow(
        'Database error'
      );
    });

    it('should handle large arrays of IDs', async () => {
      const largeIdArray = Array.from({ length: 100 }, (_, i) => i + 1);
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.find.mockResolvedValue([]);

      await service.getCountriesByIds(largeIdArray);

      expect(countryRepository.find).toHaveBeenCalledWith({
        where: {
          id: In(largeIdArray),
          organizationId: 1,
        },
        order: {
          name: 'ASC',
        },
      });
    });
  });
});
