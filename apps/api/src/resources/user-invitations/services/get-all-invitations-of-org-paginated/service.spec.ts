// apps/api/src/resources/user-invitations/services/get-all-invitations-of-org-paginated/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllInvitationsOfOrgPaginatedService } from './service';
import { UserInvitationEntity } from '../../../../database/entities/user-invitation.entity';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { paginate } from 'nestjs-typeorm-paginate';
import { UserOrganizationRole } from '@connect-phone/shared-types';
import {
  createMockOrganization,
  createMockUser,
  createMockUserInvitation,
  createCurrentOrganizationServiceProvider,
} from '../../../../test/factories';

//--------------------------------------------------------------------------------

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('GetAllInvitationsOfOrgPaginatedService', () => {
  let service: GetAllInvitationsOfOrgPaginatedService;
  let userInvitationRepository: jest.Mocked<Repository<UserInvitationEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;
  let mockPaginate: jest.MockedFunction<typeof paginate>;

  const mockOrganization = createMockOrganization();
  const mockUser = createMockUser();
  const mockUserInvitation = createMockUserInvitation();
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
      first: '/invitations/paginated?page=1&limit=10',
      previous: '',
      next: '',
      last: '/invitations/paginated?page=1&limit=10',
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
        createCurrentOrganizationServiceProvider(),
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
    it('should return paginated user invitations for current organization', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      const result = await service.findAllByOrganizationPaginated(
        1,
        10,
        '',
        'all'
      );

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
        route: '/invitations/paginated',
      });
      expect(result).toEqual(mockPaginationResult);
    });

    it('should use default parameter values', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.findAllByOrganizationPaginated();

      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 10,
        route: '/invitations/paginated',
      });
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });

    it('should validate limit bounds (minimum 1)', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.findAllByOrganizationPaginated(1, 0);

      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 1,
        route: '/invitations/paginated',
      });
    });

    it('should validate limit bounds (maximum 100)', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.findAllByOrganizationPaginated(1, 150);

      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 1,
        limit: 100,
        route: '/invitations/paginated',
      });
    });

    it('should add search functionality when search term provided', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.findAllByOrganizationPaginated(
        1,
        10,
        'test@example.com',
        'all'
      );

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'userInvitation.email ILIKE :search',
        { search: '%test@example.com%' }
      );
    });

    it('should trim search term and handle spaces', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.findAllByOrganizationPaginated(
        1,
        10,
        '  user@domain.com  ',
        'all'
      );

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'userInvitation.email ILIKE :search',
        { search: '%user@domain.com%' }
      );
    });

    it('should not add search when search term is empty or whitespace', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.findAllByOrganizationPaginated(1, 10, '   ', 'all');

      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        expect.stringContaining('ILIKE'),
        expect.any(Object)
      );
    });

    it('should add role filtering when role is specified', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.findAllByOrganizationPaginated(1, 10, '', 'admin');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'userInvitation.role = :role',
        { role: 'ADMIN' }
      );
    });

    it('should handle role case insensitively', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.findAllByOrganizationPaginated(1, 10, '', 'OpErAtOr');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'userInvitation.role = :role',
        { role: 'OPERATOR' }
      );
    });

    it('should not add role filtering when role is "all"', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.findAllByOrganizationPaginated(1, 10, '', 'all');

      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        'userInvitation.role = :role',
        expect.any(Object)
      );
    });

    it('should handle both search and role filters together', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.findAllByOrganizationPaginated(
        1,
        10,
        'test@example.com',
        'admin'
      );

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(2);
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
        1,
        'userInvitation.email ILIKE :search',
        {
          search: '%test@example.com%',
        }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenNthCalledWith(
        2,
        'userInvitation.role = :role',
        {
          role: 'ADMIN',
        }
      );
    });

    it('should handle different page and limit values', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      mockPaginate.mockResolvedValue(mockPaginationResult);

      await service.findAllByOrganizationPaginated(3, 25, '', 'all');

      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, {
        page: 3,
        limit: 25,
        route: '/invitations/paginated',
      });
    });
  });
});

// apps/api/src/resources/user-invitations/services/get-all-invitations-of-org-paginated/service.spec.ts
