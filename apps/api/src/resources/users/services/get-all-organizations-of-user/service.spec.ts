// apps/api/src/resources/users/services/get-all-organizations-of-user/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { GetAllOrganizationsOfUserController } from './controller';
import { GetAllOrganizationsOfUserService } from './service';
import { Organization } from '../../../../database/entities/organization.entity';
import {
  UserOrganization,
  UserOrganizationRole,
} from '../../../../database/entities/user-organization.entity';

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
