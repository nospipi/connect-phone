// apps/api/src/resources/countries/services/get-all-countries-of-org/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllCountriesOfOrgService } from './service';
import { CountryEntity } from '../../../../database/entities/country.entity';
import { ICountry, CountryRegion } from '@connect-phone/shared-types';

describe('GetAllCountriesOfOrgService', () => {
  let service: GetAllCountriesOfOrgService;
  let countryRepository: jest.Mocked<Repository<CountryEntity>>;

  const mockCountries: ICountry[] = [
    {
      id: 1,
      name: 'Greece',
      code: 'gr',
      flagAvatarUrl: 'https://flagcdn.com/56x42/gr.webp',
      flagProductImageUrl: 'https://flagcdn.com/192x144/gr.webp',
      region: CountryRegion.EUROPE,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'United States',
      code: 'US',
      flagAvatarUrl: 'https://flagcdn.com/56x42/us.webp',
      flagProductImageUrl: 'https://flagcdn.com/192x144/us.webp',
      region: CountryRegion.AMERICA,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ];

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
      ],
    }).compile();

    service = module.get<GetAllCountriesOfOrgService>(
      GetAllCountriesOfOrgService
    );
    countryRepository = module.get(getRepositoryToken(CountryEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCountries', () => {
    it('should return all countries ordered by name', async () => {
      countryRepository.find.mockResolvedValue(
        mockCountries as CountryEntity[]
      );

      const result = await service.getAllCountries();

      expect(countryRepository.find).toHaveBeenCalledWith({
        order: {
          name: 'ASC',
        },
      });
      expect(result).toEqual(mockCountries);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no countries exist', async () => {
      countryRepository.find.mockResolvedValue([]);

      const result = await service.getAllCountries();

      expect(countryRepository.find).toHaveBeenCalledWith({
        order: {
          name: 'ASC',
        },
      });
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle database errors', async () => {
      countryRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(service.getAllCountries()).rejects.toThrow('Database error');

      expect(countryRepository.find).toHaveBeenCalledTimes(1);
    });
  });
});
