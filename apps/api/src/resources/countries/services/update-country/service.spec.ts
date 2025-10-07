// apps/api/src/resources/countries/services/update-country/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UpdateCountryService } from './service';
import { CountryEntity } from '../../../../database/entities/country.entity';
import { UpdateCountryDto } from './update-country.dto';
import { ICountry, CountryRegion } from '@connect-phone/shared-types';

describe('UpdateCountryService', () => {
  let service: UpdateCountryService;
  let countryRepository: jest.Mocked<Repository<CountryEntity>>;

  const mockCountry: ICountry = {
    id: 1,
    name: 'Greece',
    code: 'gr',
    flagAvatarUrl: 'https://flagcdn.com/56x42/gr.webp',
    flagProductImageUrl: 'https://flagcdn.com/192x144/gr.webp',
    region: CountryRegion.EUROPE,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCountryService,
        {
          provide: getRepositoryToken(CountryEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UpdateCountryService>(UpdateCountryService);
    countryRepository = module.get(getRepositoryToken(CountryEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateCountry', () => {
    it('should update a country successfully', async () => {
      const updateDto: UpdateCountryDto = {
        id: 1,
        name: 'Hellenic Republic',
        region: CountryRegion.EUROPE,
      };

      const updatedCountry = {
        ...mockCountry,
        name: 'Hellenic Republic',
      };

      countryRepository.findOne.mockResolvedValue(mockCountry as CountryEntity);
      countryRepository.save.mockResolvedValue(updatedCountry as CountryEntity);

      const result = await service.updateCountry(updateDto);

      expect(countryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(countryRepository.save).toHaveBeenCalled();
      expect(result.name).toBe('Hellenic Republic');
    });

    it('should throw NotFoundException when id is not provided', async () => {
      const updateDto: UpdateCountryDto = {
        name: 'Updated Name',
      };

      await expect(service.updateCountry(updateDto)).rejects.toThrow(
        new NotFoundException('Country ID is required')
      );

      expect(countryRepository.findOne).not.toHaveBeenCalled();
      expect(countryRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when country does not exist', async () => {
      const updateDto: UpdateCountryDto = {
        id: 999,
        name: 'Updated Name',
      };

      countryRepository.findOne.mockResolvedValue(null);

      await expect(service.updateCountry(updateDto)).rejects.toThrow(
        new NotFoundException('Country with ID 999 not found')
      );

      expect(countryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(countryRepository.save).not.toHaveBeenCalled();
    });

    it('should update only provided fields', async () => {
      const updateDto: UpdateCountryDto = {
        id: 1,
        name: 'Updated Name',
      };

      countryRepository.findOne.mockResolvedValue(mockCountry as CountryEntity);
      countryRepository.save.mockImplementation(
        async (entity) => entity as CountryEntity
      );

      await service.updateCountry(updateDto);

      const savedCountry = countryRepository.save.mock.calls[0][0];
      expect(savedCountry.name).toBe('Updated Name');
      expect(savedCountry.code).toBe('GR');
      expect(savedCountry.region).toBe(CountryRegion.EUROPE);
    });

    it('should update flag URLs when provided', async () => {
      const updateDto: UpdateCountryDto = {
        id: 1,
        flagAvatarUrl: 'https://example.com/new-avatar.webp',
        flagProductImageUrl: 'https://example.com/new-product.webp',
      };

      const updatedCountry = {
        ...mockCountry,
        flagAvatarUrl: 'https://example.com/new-avatar.webp',
        flagProductImageUrl: 'https://example.com/new-product.webp',
      };

      countryRepository.findOne.mockResolvedValue(mockCountry as CountryEntity);
      countryRepository.save.mockResolvedValue(updatedCountry as CountryEntity);

      const result = await service.updateCountry(updateDto);

      expect(result.flagAvatarUrl).toBe('https://example.com/new-avatar.webp');
      expect(result.flagProductImageUrl).toBe(
        'https://example.com/new-product.webp'
      );
    });

    it('should handle database errors', async () => {
      const updateDto: UpdateCountryDto = {
        id: 1,
        name: 'Updated Name',
      };

      countryRepository.findOne.mockResolvedValue(mockCountry as CountryEntity);
      countryRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.updateCountry(updateDto)).rejects.toThrow(
        'Database error'
      );
    });
  });
});
