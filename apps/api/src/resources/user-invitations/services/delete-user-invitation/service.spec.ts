// apps/api/src/resources/user-invitations/services/delete-user-invitation/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { DeleteUserInvitationService } from './service';
import { UserInvitationEntity } from '../../../../database/entities/user-invitation.entity';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import {
  IOrganization,
  IUser,
  IUserInvitation,
  UserOrganizationRole,
} from '@connect-phone/shared-types';

describe('DeleteUserInvitationService', () => {
  let service: DeleteUserInvitationService;
  let userInvitationRepository: jest.Mocked<Repository<UserInvitationEntity>>;
  let currentOrganizationService: jest.Mocked<CurrentOrganizationService>;

  const mockOrganization: IOrganization = {
    id: 31,
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
    loggedOrganizationId: 31,
    loggedOrganization: mockOrganization,
    userOrganizations: [],
    auditLogs: [],
  } as IUser;

  const mockUserInvitation: IUserInvitation = {
    id: 1,
    email: 'invite@example.com',
    role: UserOrganizationRole.OPERATOR,
    createdAt: '2024-01-01T00:00:00Z',
    organizationId: 31,
    organization: mockOrganization,
    invitedById: 1,
    invitedBy: mockUser,
  } as IUserInvitation;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserInvitationService,
        {
          provide: getRepositoryToken(UserInvitationEntity),
          useValue: {
            findOne: jest.fn(),
            remove: jest.fn(),
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

    service = module.get<DeleteUserInvitationService>(
      DeleteUserInvitationService
    );
    userInvitationRepository = module.get(
      getRepositoryToken(UserInvitationEntity)
    );
    currentOrganizationService = module.get(CurrentOrganizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deleteUserInvitation', () => {
    it('should delete a user invitation successfully', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      userInvitationRepository.findOne.mockResolvedValue(mockUserInvitation);
      userInvitationRepository.remove.mockResolvedValue(mockUserInvitation);

      const result = await service.deleteUserInvitation(1);

      expect(
        currentOrganizationService.getCurrentOrganization
      ).toHaveBeenCalledTimes(1);
      expect(userInvitationRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['organization', 'invitedBy'],
      });
      expect(userInvitationRepository.remove).toHaveBeenCalledWith(
        mockUserInvitation
      );
      expect(result).toEqual(mockUserInvitation);
    });

    it('should throw NotFoundException when invitation does not exist', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      userInvitationRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteUserInvitation(999)).rejects.toThrow(
        new NotFoundException('User invitation with ID 999 not found')
      );

      expect(userInvitationRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when invitation belongs to different organization', async () => {
      const differentOrgInvitation = {
        ...mockUserInvitation,
        organizationId: 999,
      };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      userInvitationRepository.findOne.mockResolvedValue(
        differentOrgInvitation
      );

      await expect(service.deleteUserInvitation(1)).rejects.toThrow(
        new ForbiddenException(
          'You can only delete invitations from your own organization'
        )
      );

      expect(userInvitationRepository.remove).not.toHaveBeenCalled();
    });

    it('should handle different invitation IDs correctly', async () => {
      const invitation2 = { ...mockUserInvitation, id: 2 };

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      userInvitationRepository.findOne.mockResolvedValue(invitation2);
      userInvitationRepository.remove.mockResolvedValue(invitation2);

      const result = await service.deleteUserInvitation(2);

      expect(userInvitationRepository.findOne).toHaveBeenCalledWith({
        where: { id: 2 },
        relations: ['organization', 'invitedBy'],
      });
      expect(result).toEqual(invitation2);
    });

    it('should handle database errors during removal', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      userInvitationRepository.findOne.mockResolvedValue(mockUserInvitation);
      userInvitationRepository.remove.mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.deleteUserInvitation(1)).rejects.toThrow(
        'Database error'
      );

      expect(userInvitationRepository.remove).toHaveBeenCalledWith(
        mockUserInvitation
      );
    });

    it('should throw ForbiddenException when organization context is null', async () => {
      currentOrganizationService.getCurrentOrganization.mockResolvedValue(null);
      userInvitationRepository.findOne.mockResolvedValue(mockUserInvitation);

      await expect(service.deleteUserInvitation(1)).rejects.toThrow(
        new ForbiddenException(
          'You can only delete invitations from your own organization'
        )
      );

      expect(userInvitationRepository.remove).not.toHaveBeenCalled();
    });

    it('should preserve invitation properties in return value', async () => {
      const fullInvitation: IUserInvitation = {
        id: 5,
        email: 'detailed@example.com',
        role: UserOrganizationRole.ADMIN,
        createdAt: '2024-01-15T00:00:00Z',
        organizationId: 31,
        organization: mockOrganization,
        invitedById: 1,
        invitedBy: mockUser,
      } as IUserInvitation;

      currentOrganizationService.getCurrentOrganization.mockResolvedValue(
        mockOrganization
      );
      userInvitationRepository.findOne.mockResolvedValue(fullInvitation);
      userInvitationRepository.remove.mockResolvedValue(fullInvitation);

      const result = await service.deleteUserInvitation(5);

      expect(result).toEqual({
        id: 5,
        email: 'detailed@example.com',
        role: UserOrganizationRole.ADMIN,
        createdAt: '2024-01-15T00:00:00Z',
        organizationId: 31,
        organization: mockOrganization,
        invitedById: 1,
        invitedBy: mockUser,
      });
    });
  });
});
