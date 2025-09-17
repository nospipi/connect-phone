// apps/api/src/resources/users/services/get-all-organizations-of-user/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reflector } from '@nestjs/core';
import { GetAllOrganizationsOfUserController } from './controller';
import { GetAllOrganizationsOfUserService } from './service';
import { Organization } from '../../../../database/entities/organization.entity';
import { User } from '@/database/entities/user.entity';
import {
  UserOrganization,
  UserOrganizationRole,
} from '../../../../database/entities/user-organization.entity';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';
import { CurrentClerkUserService } from '../../../../common/core/current-clerk-user.service';

describe('GetAllOrganizationsOfUserController', () => {
  let controller: GetAllOrganizationsOfUserController;
  let service: jest.Mocked<GetAllOrganizationsOfUserService>;

  const mockOrganizations: (Organization & { role: UserOrganizationRole })[] = [
    {
      id: 1,
      name: 'Organization 1',
      slug: 'org-1',
      logoUrl: null,
      createdAt: '2024-01-01T00:00:00Z',
      salesChannels: [],
      userOrganizations: [] as UserOrganization[],
      auditLogs: [],
      role: UserOrganizationRole.ADMIN,
    } as unknown as Organization & { role: UserOrganizationRole },
    {
      id: 2,
      name: 'Organization 2',
      slug: 'org-2',
      logoUrl: 'https://example.com/logo.png',
      createdAt: '2024-01-02T00:00:00Z',
      salesChannels: [],
      userOrganizations: [] as UserOrganization[],
      auditLogs: [],
      role: UserOrganizationRole.OPERATOR,
    } as unknown as Organization & { role: UserOrganizationRole },
  ];

  beforeEach(async () => {
    const mockService = {
      getAllOrganizationsOfCurrentUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetAllOrganizationsOfUserController],
      providers: [
        {
          provide: GetAllOrganizationsOfUserService,
          useValue: mockService,
        },
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn().mockReturnValue(false),
          },
        },
        {
          provide: CurrentDbUserService,
          useValue: {
            getCurrentDbUser: jest.fn(),
          },
        },
        {
          provide: CurrentClerkUserService,
          useValue: {
            getClerkUserEmail: jest.fn(),
            getClerkUser: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Organization),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GetAllOrganizationsOfUserController>(
      GetAllOrganizationsOfUserController
    );
    service = module.get(GetAllOrganizationsOfUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllOrganizations', () => {
    it('should return all organizations for the current user', async () => {
      // Arrange
      service.getAllOrganizationsOfCurrentUser.mockResolvedValue(
        mockOrganizations
      );

      // Act
      const result = await controller.getAllOrganizations();

      // Assert
      expect(service.getAllOrganizationsOfCurrentUser).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockOrganizations);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when user has no organizations', async () => {
      // Arrange
      service.getAllOrganizationsOfCurrentUser.mockResolvedValue([]);

      // Act
      const result = await controller.getAllOrganizations();

      // Assert
      expect(service.getAllOrganizationsOfCurrentUser).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should propagate service errors', async () => {
      // Arrange
      const error = new Error('Service error');
      service.getAllOrganizationsOfCurrentUser.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.getAllOrganizations()).rejects.toThrow(
        'Service error'
      );
      expect(service.getAllOrganizationsOfCurrentUser).toHaveBeenCalledTimes(1);
    });
  });
});
