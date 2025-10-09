// apps/api/src/resources/organizations/services/update-organization/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForbiddenException } from '@nestjs/common';
import { UpdateOrganizationService } from './service';
import { OrganizationEntity } from '../../../../database/entities/organization.entity';
import { UpdateOrganizationDto } from './update-organization.dto';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import {
  createMockOrganization,
  createCurrentOrganizationServiceProvider,
} from '../../../../test/factories';

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
    it('should update organization name', async () => {
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

      const result = await service.updateOrganization(updateDto);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(organizationRepository.save).toHaveBeenCalled();
      expect(result.name).toBe('Updated Organization');
    });

    it('should update organization logoUrl', async () => {
      const updateDto: UpdateOrganizationDto = {
        logoUrl: 'https://example.com/new-logo.png',
      };

      const updatedOrganization = createMockOrganization({
        logoUrl: 'https://example.com/new-logo.png',
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      organizationRepository.save.mockResolvedValue(
        updatedOrganization as OrganizationEntity
      );

      const result = await service.updateOrganization(updateDto);

      expect(result.logoUrl).toBe('https://example.com/new-logo.png');
    });

    it('should update both name and logoUrl', async () => {
      const updateDto: UpdateOrganizationDto = {
        name: 'Updated Organization',
        logoUrl: 'https://example.com/new-logo.png',
      };

      const updatedOrganization = createMockOrganization({
        name: 'Updated Organization',
        logoUrl: 'https://example.com/new-logo.png',
      });

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      organizationRepository.save.mockResolvedValue(
        updatedOrganization as OrganizationEntity
      );

      const result = await service.updateOrganization(updateDto);

      expect(result.name).toBe('Updated Organization');
      expect(result.logoUrl).toBe('https://example.com/new-logo.png');
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
