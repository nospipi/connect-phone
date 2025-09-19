// src/resources/users/services/log-user-in-organization/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { LogUserInOrganizationService } from './service';
import { UserEntity } from '../../../../database/entities/user.entity';
import {
  IUser,
  IOrganization,
  ISalesChannel,
  IUserOrganization,
} from '@connect-phone/shared-types';
import { OrganizationEntity } from '../../../../database/entities/organization.entity';
import { UserOrganizationEntity } from '../../../../database/entities/user-organization.entity';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';

//-------------------------------------------------------------------------------------------------

describe('LogUserInOrganizationService', () => {
  let service: LogUserInOrganizationService;
  let userRepository: jest.Mocked<Repository<UserEntity>>;
  let organizationRepository: jest.Mocked<Repository<OrganizationEntity>>;
  let currentDbUserService: jest.Mocked<CurrentDbUserService>;

  const mockOrganization: IOrganization = {
    id: 1,
    name: 'Org One',
    slug: 'org-one',
    logoUrl: null,
    createdAt: '2025-01-01T00:00:00Z',
    salesChannels: [],
    userOrganizations: [],
  } as unknown as IOrganization;

  const mockUserOrg: IUserOrganization = {
    id: 1,
    user: null,
    userId: 1,
    organization: mockOrganization,
    organizationId: mockOrganization.id,
    role: 'ADMIN',
  } as unknown as IUserOrganization;

  const mockUser: IUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    createdAt: '2025-01-01T00:00:00Z',
    loggedOrganizationId: null,
    loggedOrganization: null,
    userOrganizations: [mockUserOrg],
  } as unknown as IUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogUserInOrganizationService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(OrganizationEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: CurrentDbUserService,
          useValue: {
            getCurrentDbUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LogUserInOrganizationService>(
      LogUserInOrganizationService
    );
    userRepository = module.get(getRepositoryToken(UserEntity));
    organizationRepository = module.get(getRepositoryToken(OrganizationEntity));
    currentDbUserService = module.get(CurrentDbUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logUserInOrganization', () => {
    it('updates loggedOrganizationId if user belongs to org', async () => {
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      organizationRepository.findOne.mockResolvedValue(mockOrganization);
      userRepository.save.mockImplementation(async (user: IUser) => {
        return {
          ...user,
        } as unknown as IUser;
      });
      const result = await service.logUserInOrganization(mockOrganization.id);

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(organizationRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockOrganization.id },
      });
      expect(userRepository.save).toHaveBeenCalled();
      expect(result.loggedOrganizationId).toBe(mockOrganization.id);
      expect(result.loggedOrganization).toBe(mockOrganization);
    });

    it('throws ForbiddenException if user does not belong to organization', async () => {
      const otherOrgId = 999;
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      organizationRepository.findOne.mockResolvedValue({
        ...mockOrganization,
        id: otherOrgId,
      } as IOrganization);

      await expect(service.logUserInOrganization(otherOrgId)).rejects.toThrow(
        ForbiddenException
      );
    });

    it('throws NotFoundException if no current user', async () => {
      currentDbUserService.getCurrentDbUser.mockResolvedValue(null);
      await expect(
        service.logUserInOrganization(mockOrganization.id)
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException if organization not found', async () => {
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      organizationRepository.findOne.mockResolvedValue(null);

      await expect(service.logUserInOrganization(12345)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
