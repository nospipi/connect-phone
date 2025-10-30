// apps/api/src/resources/organizations/services/update-organization/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForbiddenException } from '@nestjs/common';
import { UpdateOrganizationService } from './service';
import { OrganizationEntity } from '@/database/entities/organization.entity';
import { UpdateOrganizationDto } from './update-organization.dto';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';
import {
  createMockOrganization,
  createCurrentOrganizationServiceProvider,
} from '@/test/factories';
import { Currency } from '@connect-phone/shared-types';

//----------------------------------------------------------------------

describe('UpdateOrganizationService', () => {
  let service: UpdateOrganizationService;
  let organizationRepository: jest.Mocked<Repository<OrganizationEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization = createMockOrganization();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateOrganizationService,
        {
          provide: getRepositoryToken(OrganizationEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
      ],
    }).compile();

    service = module.get<UpdateOrganizationService>(UpdateOrganizationService);
    organizationRepository = module.get(getRepositoryToken(OrganizationEntity));
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateOrganization', () => {
    it('should update organization name and return with logo relation', async () => {
      const updateDto: UpdateOrganizationDto = {
        name: 'Updated Organization',
      };

      const updatedOrganization = createMockOrganization({
        name: 'Updated Organization',
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      organizationRepository.save.mockResolvedValue(
        updatedOrganization as OrganizationEntity
      );
      organizationRepository.findOne.mockResolvedValue(
        updatedOrganization as OrganizationEntity
      );

      const result = await service.updateOrganization(updateDto);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(organizationRepository.save).toHaveBeenCalled();
      expect(organizationRepository.findOne).toHaveBeenCalledWith({
        where: { id: updatedOrganization.id },
        relations: ['logo'],
      });
      expect(result.name).toBe('Updated Organization');
    });

    it('should update organization logoId and return with logo relation', async () => {
      const updateDto: UpdateOrganizationDto = {
        logoId: 5,
      };

      const updatedOrganization = createMockOrganization({
        logoId: 5,
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      organizationRepository.save.mockResolvedValue(
        updatedOrganization as OrganizationEntity
      );
      organizationRepository.findOne.mockResolvedValue(
        updatedOrganization as OrganizationEntity
      );

      const result = await service.updateOrganization(updateDto);

      expect(organizationRepository.findOne).toHaveBeenCalledWith({
        where: { id: updatedOrganization.id },
        relations: ['logo'],
      });
      expect(result.logoId).toBe(5);
    });

    it('should update organization mainCurrency and return with logo relation', async () => {
      const updateDto: UpdateOrganizationDto = {
        mainCurrency: Currency.EUR,
      };

      const updatedOrganization = createMockOrganization({
        mainCurrency: Currency.EUR,
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      organizationRepository.save.mockResolvedValue(
        updatedOrganization as OrganizationEntity
      );
      organizationRepository.findOne.mockResolvedValue(
        updatedOrganization as OrganizationEntity
      );

      const result = await service.updateOrganization(updateDto);

      expect(organizationRepository.findOne).toHaveBeenCalledWith({
        where: { id: updatedOrganization.id },
        relations: ['logo'],
      });
      expect(result.mainCurrency).toBe(Currency.EUR);
    });

    it('should update both name and logoId and return with logo relation', async () => {
      const updateDto: UpdateOrganizationDto = {
        name: 'Updated Organization',
        logoId: 5,
      };

      const updatedOrganization = createMockOrganization({
        name: 'Updated Organization',
        logoId: 5,
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      organizationRepository.save.mockResolvedValue(
        updatedOrganization as OrganizationEntity
      );
      organizationRepository.findOne.mockResolvedValue(
        updatedOrganization as OrganizationEntity
      );

      const result = await service.updateOrganization(updateDto);

      expect(organizationRepository.findOne).toHaveBeenCalledWith({
        where: { id: updatedOrganization.id },
        relations: ['logo'],
      });
      expect(result.name).toBe('Updated Organization');
      expect(result.logoId).toBe(5);
    });

    it('should update name, logoId, and mainCurrency and return with logo relation', async () => {
      const updateDto: UpdateOrganizationDto = {
        name: 'Updated Organization',
        logoId: 5,
        mainCurrency: Currency.GBP,
      };

      const updatedOrganization = createMockOrganization({
        name: 'Updated Organization',
        logoId: 5,
        mainCurrency: Currency.GBP,
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      organizationRepository.save.mockResolvedValue(
        updatedOrganization as OrganizationEntity
      );
      organizationRepository.findOne.mockResolvedValue(
        updatedOrganization as OrganizationEntity
      );

      const result = await service.updateOrganization(updateDto);

      expect(organizationRepository.findOne).toHaveBeenCalledWith({
        where: { id: updatedOrganization.id },
        relations: ['logo'],
      });
      expect(result.name).toBe('Updated Organization');
      expect(result.logoId).toBe(5);
      expect(result.mainCurrency).toBe(Currency.GBP);
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      const updateDto: UpdateOrganizationDto = {
        name: 'Updated Organization',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);

      await expect(service.updateOrganization(updateDto)).rejects.toThrow(
        new ForbiddenException('Organization context required')
      );

      expect(organizationRepository.save).not.toHaveBeenCalled();
      expect(organizationRepository.findOne).not.toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      const updateDto: UpdateOrganizationDto = {
        name: 'Updated Organization',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      organizationRepository.save.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.updateOrganization(updateDto)).rejects.toThrow(
        'Database error'
      );
    });
  });
});
