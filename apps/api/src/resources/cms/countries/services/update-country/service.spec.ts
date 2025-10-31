// apps/api/src/resources/cms/countries/services/update-country/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UpdateCountryService } from './service';
import { CountryEntity } from '@/database/entities/country.entity';
import { UpdateCountryDto } from './update-country.dto';
import { CountryRegion } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';
import {
  createMockOrganization,
  createMockCountry,
  createCurrentOrganizationServiceProvider,
} from '@/test/factories';

//--------------------------------------------------------------------------------

describe('UpdateCountryService', () => {
  let service: UpdateCountryService;
  let countryRepository: jest.Mocked<Repository<CountryEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();
  const mockCountry = createMockCountry();

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
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<UpdateCountryService>(UpdateCountryService);
    countryRepository = module.get(getRepositoryToken(CountryEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
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
        flagAvatarUrl: 'https://example.com/new-avatar.webp',
        flagProductImageUrl: 'https://example.com/new-product.webp',
      };

      const updatedCountry = createMockCountry({
        flagAvatarUrl: 'https://example.com/new-avatar.webp',
        flagProductImageUrl: 'https://example.com/new-product.webp',
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.findOne.mockResolvedValue(mockCountry as CountryEntity);
      countryRepository.save.mockResolvedValue(updatedCountry as CountryEntity);

      const result = await service.updateCountry(updateDto);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(countryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, organizationId: 1 },
      });
      expect(countryRepository.save).toHaveBeenCalled();
      expect(result.flagAvatarUrl).toBe('https://example.com/new-avatar.webp');
      expect(result.flagProductImageUrl).toBe(
        'https://example.com/new-product.webp'
      );
    });

    it('should throw NotFoundException when id is not provided', async () => {
      const updateDto: UpdateCountryDto = {
        flagAvatarUrl: 'https://example.com/avatar.webp',
      };

      await expect(service.updateCountry(updateDto)).rejects.toThrow(
        new NotFoundException('Country ID is required')
      );

      expect(
        currentOrganizationService.getCurrentOrganization
      ).not.toHaveBeenCalled();
      expect(countryRepository.findOne).not.toHaveBeenCalled();
      expect(countryRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      const updateDto: UpdateCountryDto = {
        id: 1,
        flagAvatarUrl: 'https://example.com/avatar.webp',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.updateCountry(updateDto)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(countryRepository.findOne).not.toHaveBeenCalled();
      expect(countryRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when country does not exist', async () => {
      const updateDto: UpdateCountryDto = {
        id: 999,
        flagAvatarUrl: 'https://example.com/avatar.webp',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.findOne.mockResolvedValue(null);

      await expect(service.updateCountry(updateDto)).rejects.toThrow(
        new NotFoundException(
          'Country with ID 999 not found in current organization'
        )
      );

      expect(countryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999, organizationId: 1 },
      });
      expect(countryRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when country belongs to different organization', async () => {
      const updateDto: UpdateCountryDto = {
        id: 1,
        flagAvatarUrl: 'https://example.com/avatar.webp',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.findOne.mockResolvedValue(null);

      await expect(service.updateCountry(updateDto)).rejects.toThrow(
        new NotFoundException(
          'Country with ID 1 not found in current organization'
        )
      );

      expect(countryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, organizationId: 1 },
      });
      expect(countryRepository.save).not.toHaveBeenCalled();
    });

    it('should update only provided fields', async () => {
      const updateDto: UpdateCountryDto = {
        id: 1,
        flagAvatarUrl: 'https://example.com/new-avatar.webp',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.findOne.mockResolvedValue(mockCountry as CountryEntity);
      countryRepository.save.mockImplementation(
        async (entity) => entity as CountryEntity
      );

      await service.updateCountry(updateDto);

      const savedCountry = countryRepository.save.mock.calls[0][0];
      expect(savedCountry.flagAvatarUrl).toBe(
        'https://example.com/new-avatar.webp'
      );
      expect(savedCountry.name).toBe('Greece');
      expect(savedCountry.code).toBe('gr');
      expect(savedCountry.region).toBe(CountryRegion.EUROPE);
    });

    it('should update flag URLs when provided', async () => {
      const updateDto: UpdateCountryDto = {
        id: 1,
        flagAvatarUrl: 'https://example.com/new-avatar.webp',
        flagProductImageUrl: 'https://example.com/new-product.webp',
      };

      const updatedCountry = createMockCountry({
        flagAvatarUrl: 'https://example.com/new-avatar.webp',
        flagProductImageUrl: 'https://example.com/new-product.webp',
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
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
        flagAvatarUrl: 'https://example.com/avatar.webp',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      countryRepository.findOne.mockResolvedValue(mockCountry as CountryEntity);
      countryRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.updateCountry(updateDto)).rejects.toThrow(
        'Database error'
      );
    });

    it('should handle different organization IDs correctly', async () => {
      const updateDto: UpdateCountryDto = {
        id: 1,
        flagAvatarUrl: 'https://example.com/avatar.webp',
      };

      const differentOrg = createMockOrganization({ id: 5 });
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        differentOrg
      );
      countryRepository.findOne.mockResolvedValue(null);

      await expect(service.updateCountry(updateDto)).rejects.toThrow(
        new NotFoundException(
          'Country with ID 1 not found in current organization'
        )
      );

      expect(countryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, organizationId: 5 },
      });
    });
  });
});

// apps/api/src/resources/countries/services/update-country/service.spec.ts
