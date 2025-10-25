// apps/api/src/resources/user-invitations/services/create-user-invitation/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInvitationService } from './service';
import { UserInvitationEntity } from '../../../../database/entities/user-invitation.entity';
import { CreateUserInvitationDto } from './create-user-invitation.dto';
import { CurrentOrganizationService } from '../../../../common/services/current-organization.service';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';
import { UserOrganizationRole } from '@connect-phone/shared-types';
import {
  createMockOrganization,
  createMockUser,
  createMockUserInvitation,
  createCurrentOrganizationServiceProvider,
  createCurrentDbUserServiceProvider,
} from '../../../../test/factories';

//--------------------------------------------------------------------------------

describe('CreateUserInvitationService', () => {
  let service: CreateUserInvitationService;
  let userInvitationRepository: jest.Mocked<Repository<UserInvitationEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;
  let currentDbUserService: jest.Mocked<CurrentDbUserService>;

  const mockOrganization = createMockOrganization({ id: 31 });
  const mockUser = createMockUser({
    loggedOrganizationId: 31,
    loggedOrganization: mockOrganization,
  });
  const mockUserInvitation = createMockUserInvitation({
    organizationId: 31,
    organization: mockOrganization,
  });
  const mockCreateUserInvitationDto: CreateUserInvitationDto = {
    email: 'invite@example.com',
    role: UserOrganizationRole.OPERATOR,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserInvitationService,
        {
          provide: getRepositoryToken(UserInvitationEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        createCurrentOrganizationServiceProvider(),
        createCurrentDbUserServiceProvider(),
      ],
    }).compile();

    service = module.get<CreateUserInvitationService>(
      CreateUserInvitationService
    );
    userInvitationRepository = module.get(
      getRepositoryToken(UserInvitationEntity)
    );
    currentOrganizationService = module.get(CurrentOrganizationService);
    currentDbUserService = module.get(CurrentDbUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUserInvitation', () => {
    it('should create a new user invitation successfully', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      userInvitationRepository.create.mockReturnValue(mockUserInvitation);
      userInvitationRepository.save.mockResolvedValue(mockUserInvitation);

      const result = await service.createUserInvitation(
        mockCreateUserInvitationDto
      );

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(userInvitationRepository.create).toHaveBeenCalledWith({
        email: mockCreateUserInvitationDto.email,
        role: mockCreateUserInvitationDto.role,
        organizationId: 31,
        invitedById: 1,
      });
      expect(userInvitationRepository.save).toHaveBeenCalledWith(
        mockUserInvitation
      );
      expect(result).toEqual(mockUserInvitation);
    });

    it('should create with undefined organizationId when organization is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      userInvitationRepository.create.mockReturnValue(mockUserInvitation);
      userInvitationRepository.save.mockResolvedValue(mockUserInvitation);

      const result = await service.createUserInvitation(
        mockCreateUserInvitationDto
      );

      expect(userInvitationRepository.create).toHaveBeenCalledWith({
        email: mockCreateUserInvitationDto.email,
        role: mockCreateUserInvitationDto.role,
        organizationId: undefined,
        invitedById: 1,
      });
      expect(result).toEqual(mockUserInvitation);
    });

    it('should handle ADMIN role correctly', async () => {
      const dtoWithAdminRole = {
        ...mockCreateUserInvitationDto,
        role: UserOrganizationRole.ADMIN,
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      userInvitationRepository.create.mockReturnValue(mockUserInvitation);
      userInvitationRepository.save.mockResolvedValue(mockUserInvitation);

      const result = await service.createUserInvitation(dtoWithAdminRole);

      expect(userInvitationRepository.create).toHaveBeenCalledWith({
        email: dtoWithAdminRole.email,
        role: UserOrganizationRole.ADMIN,
        organizationId: 31,
        invitedById: 1,
      });
      expect(result).toEqual(mockUserInvitation);
    });

    it('should handle database errors', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      userInvitationRepository.create.mockReturnValue(mockUserInvitation);
      userInvitationRepository.save.mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        service.createUserInvitation(mockCreateUserInvitationDto)
      ).rejects.toThrow('Database error');
    });

    it('should handle different email formats', async () => {
      const dtoWithDifferentEmail = {
        ...mockCreateUserInvitationDto,
        email: 'test.user+tag@example.co.uk',
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      userInvitationRepository.create.mockReturnValue(mockUserInvitation);
      userInvitationRepository.save.mockResolvedValue(mockUserInvitation);

      const result = await service.createUserInvitation(dtoWithDifferentEmail);

      expect(userInvitationRepository.create).toHaveBeenCalledWith({
        email: 'test.user+tag@example.co.uk',
        role: mockCreateUserInvitationDto.role,
        organizationId: 31,
        invitedById: 1,
      });
      expect(result).toEqual(mockUserInvitation);
    });
  });
});

// apps/api/src/resources/user-invitations/services/create-user-invitation/service.spec.ts
