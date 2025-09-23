// apps/api/src/resources/users/services/get-all-invitations-of-org-paginated/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllInvitationsOfOrgPaginatedService } from './service';
import { UserInvitationEntity } from '../../../../database/entities/user-invitation.entity';
import { UserOrganizationRole } from '@connect-phone/shared-types';
import { OrganizationEntity } from '../../../../database/entities/organization.entity';
import { UserEntity } from '../../../../database/entities/user.entity';
import {
  IUser,
  IOrganization,
  IUserInvitation,
} from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { paginate } from 'nestjs-typeorm-paginate';

//--------------------------------------------------------------------------------------------------

// Mock paginate function
jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('GetAllInvitationsOfOrgPaginatedService', () => {
  let service: GetAllInvitationsOfOrgPaginatedService;
  let userInvitationRepository: jest.Mocked<Repository<UserInvitationEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;
  let mockPaginate: jest.MockedFunction<typeof paginate>;

  const mockOrganization: IOrganization = {
    id: 1,
    name: 'Test Organization',
    slug: 'test-org',
    logoUrl: null,
    createdAt: '2024-01-01T00:00:00Z',
    salesChannels: [],
    userOrganizations: [],
    auditLogs: [],
  } as IOrganization;

  const mockUser: IUser = {
    id: 1,
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    createdAt: '2024-01-01T00:00:00Z',
    loggedOrganizationId: 1,
    loggedOrganization: mockOrganization,
    userOrganizations: [],
    auditLogs: [],
  } as IUser;

  const mockUserInvitation: IUserInvitation = {
    id: 1,
    email: 'test@example.com',
    role: UserOrganizationRole.ADMIN,
    status: 'PENDING',
    createdAt: '2024-01-01T00:00:00Z',
    organizationId: 1,
    organization: mockOrganization,
    invitedById: 1,
    invitedBy: mockUser,
  } as IUserInvitation;

  const mockPaginationResult = {
    items: [mockUserInvitation],
    meta: {
      itemCount: 1,
      totalItems: 1,
      itemsPerPage: 10,
      totalPages: 1,
      currentPage: 1,
    },
    links: {
      first: '/users/invitations/paginated?page=1&limit=10',
      previous: '',
      next: '',
      last: '/users/invitations/paginated?page=1&limit=10',
    },
  };

  const mockQueryBuilder = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllInvitationsOfOrgPaginatedService,
        {
          provide: getRepositoryToken(UserInvitationEntity),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
        {
          provide: CurrentOrganizationService,
          useValue: {
            getCurrentOrganization: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GetAllInvitationsOfOrgPaginatedService>(
      GetAllInvitationsOfOrgPaginatedService
    );
    userInvitationRepository = module.get(
      getRepositoryToken(UserInvitationEntity)
    );
    currentOrganizationService = module.get(CurrentOrganizationService);
    mockPaginate = paginate as jest.MockedFunction<typeof paginate>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllByOrganizationPaginated', () => {
    it('should return paginated invitations for current organization', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      const result = await service.findAllByOrganizationPaginated(
        1,
        10,
        '',
        'all',
        'all'
      );

      // Assert
      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(userInvitationRepository.createQueryBuilder).toHaveBeenCalledWith(
        'userInvitation'
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'userInvitation.organization',
        'organization'
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'userInvitation.invitedBy',
        'invitedBy'
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'userInvitation.organizationId = :organizationId',
        { organizationId: 1 }
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'userInvitation.id',
        'DESC'
      );
      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 10,
        route: '/users/invitations/paginated',
      });
      expect(result).toEqual(mockPaginationResult);
    });

    it('should use default parameter values', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated();

      // Assert
      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 10,
        route: '/users/invitations/paginated',
      });
      // Should not call andWhere for search, role, or status since they're defaults
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });

    it('should validate limit bounds (minimum 1)', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(1, 0);

      // Assert
      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 1, // Should be corrected to minimum of 1
        route: '/users/invitations/paginated',
      });
    });

    it('should validate limit bounds (maximum 100)', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(1, 150);

      // Assert
      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 100, // Should be corrected to maximum of 100
        route: '/users/invitations/paginated',
      });
    });

    it('should add search functionality when search term provided', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(
        1,
        10,
        'john@example.com',
        'all',
        'all'
      );

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'userInvitation.email ILIKE :search',
        { search: '%john@example.com%' }
      );
    });

    it('should trim search term and handle spaces', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(
        1,
        10,
        '  test@example.com  ',
        'all',
        'all'
      );

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'userInvitation.email ILIKE :search',
        { search: '%test@example.com%' }
      );
    });

    it('should not add search when search term is empty or whitespace', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(1, 10, '   ', 'all', 'all');

      // Assert
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        expect.stringContaining('ILIKE'),
        expect.any(Object)
      );
    });

    it('should add role filtering when role is specified', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(1, 10, '', 'admin', 'all');

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'userInvitation.role = :role',
        { role: 'ADMIN' }
      );
    });

    it('should handle role case insensitively', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(
        1,
        10,
        '',
        'OpErAtOr',
        'all'
      );

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'userInvitation.role = :role',
        { role: 'OPERATOR' }
      );
    });

    it('should not add role filtering when role is "all"', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(1, 10, '', 'all', 'all');

      // Assert
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        'userInvitation.role = :role',
        expect.any(Object)
      );
    });

    it('should add status filtering when status is specified', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(1, 10, '', 'all', 'pending');

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'userInvitation.status = :status',
        { status: 'PENDING' }
      );
    });

    it('should handle status case insensitively', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(
        1,
        10,
        '',
        'all',
        'AcCePtEd'
      );

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'userInvitation.status = :status',
        { status: 'ACCEPTED' }
      );
    });

    it('should not add status filtering when status is "all"', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(1, 10, '', 'all', 'all');

      // Assert
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        'userInvitation.status = :status',
        expect.any(Object)
      );
    });

    it('should handle search, role, and status filtering together', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(
        1,
        10,
        'test@example.com',
        'admin',
        'pending'
      );

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(3);
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
        1,
        'userInvitation.email ILIKE :search',
        { search: '%test@example.com%' }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
        2,
        'userInvitation.role = :role',
        { role: 'ADMIN' }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
        3,
        'userInvitation.status = :status',
        { status: 'PENDING' }
      );
    });

    it('should handle different page and limit values', async () => {
      // Arrange
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      // Act
      await service.findAllByOrganizationPaginated(3, 25, '', 'all', 'all');

      // Assert
      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 3,
        limit: 25,
        route: '/users/invitations/paginated',
      });
    });
  });
});
