// apps/api/src/resources/users/services/log-out-user-from-organization/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { LogOutUserFromOrganizationService } from './service';
import { User } from '../../../../database/entities/user.entity';
import { Organization } from '../../../../database/entities/organization.entity';
import { UserOrganization } from '../../../../database/entities/user-organization.entity';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';

//-------------------------------------------------------------------------------------------------

describe('LogOutUserFromOrganizationService', () => {
  let service: LogOutUserFromOrganizationService;
  let userRepository: jest.Mocked<Repository<User>>;
  let currentDbUserService: jest.Mocked<CurrentDbUserService>;

  const mockOrganization: Organization = {
    id: 1,
    name: 'Org One',
    slug: 'org-one',
    logoUrl: null,
    createdAt: '2025-01-01T00:00:00Z',
    salesChannels: [],
    userOrganizations: [],
  } as unknown as Organization;

  const mockUserOrg: UserOrganization = {
    id: 1,
    user: null,
    userId: 1,
    organization: mockOrganization,
    organizationId: mockOrganization.id,
    role: 'ADMIN',
  } as unknown as UserOrganization;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    createdAt: '2025-01-01T00:00:00Z',
    loggedOrganizationId: 1,
    loggedOrganization: mockOrganization,
    userOrganizations: [mockUserOrg],
  } as unknown as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogOutUserFromOrganizationService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
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

    service = module.get<LogOutUserFromOrganizationService>(
      LogOutUserFromOrganizationService
    );
    userRepository = module.get(getRepositoryToken(User));
    currentDbUserService = module.get(CurrentDbUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logOutUserFromOrganization', () => {
    it('should log out user by setting loggedOrganizationId to null', async () => {
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      userRepository.save.mockImplementation(async (user: User) => {
        return {
          ...user,
          get fullName() {
            return `${user.firstName} ${user.lastName}`;
          },
        } as unknown as User;
      });

      const result = await service.logOutUserFromOrganization();

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalled();
      expect(result.loggedOrganizationId).toBe(null);
      expect(result.loggedOrganization).toBe(null);
    });

    it('should throw NotFoundException if no current user', async () => {
      currentDbUserService.getCurrentDbUser.mockResolvedValue(null);

      await expect(service.logOutUserFromOrganization()).rejects.toThrow(
        NotFoundException
      );
      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should work even if user is already logged out', async () => {
      const loggedOutUser = {
        ...mockUser,
        loggedOrganizationId: null,
        loggedOrganization: null,
        get fullName() {
          return `${this.firstName} ${this.lastName}`;
        },
      } as unknown as User;

      currentDbUserService.getCurrentDbUser.mockResolvedValue(loggedOutUser);
      userRepository.save.mockImplementation(async (user: User) => {
        return {
          ...user,
          get fullName() {
            return `${user.firstName} ${user.lastName}`;
          },
        } as unknown as User;
      });

      const result = await service.logOutUserFromOrganization();

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalled();
      expect(result.loggedOrganizationId).toBe(null);
      expect(result.loggedOrganization).toBe(null);
    });
  });
});
