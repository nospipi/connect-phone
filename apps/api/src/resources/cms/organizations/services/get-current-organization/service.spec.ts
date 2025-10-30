// apps/api/src/resources/organizations/services/get-current-organization/service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GetCurrentOrganizationService } from './service';
import { OrganizationEntity } from '../.././../../../database/entities/organization.entity';
import { CurrentDbUserService } from '../../../../../common/services/current-db-user.service';
import {
  createMockOrganization,
  createMockUser,
  createCurrentDbUserServiceProvider,
} from '../../../../../test/factories';

//----------------------------------------------------------------------

describe('GetCurrentOrganizationService', () => {
  let service: GetCurrentOrganizationService;
  let organizationRepository: jest.Mocked<any>;
  let currentDbUserService: jest.Mocked<CurrentDbUserService>;

  const mockOrganization = createMockOrganization();
  const mockUser = createMockUser({
    loggedOrganizationId: 1,
    loggedOrganization: mockOrganization,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCurrentOrganizationService,
        {
          provide: getRepositoryToken(OrganizationEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        createCurrentDbUserServiceProvider(),
      ],
    }).compile();

    service = module.get<GetCurrentOrganizationService>(
      GetCurrentOrganizationService
    );
    organizationRepository = module.get(getRepositoryToken(OrganizationEntity));
    currentDbUserService = module.get(CurrentDbUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCurrentOrganization', () => {
    it('should return current organization with logo relation', async () => {
      currentDbUserService.getCurrentDbUser.mockResolvedValue(mockUser);
      organizationRepository.findOne.mockResolvedValue(mockOrganization);

      const result = await service.getCurrentOrganization();

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(organizationRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['logo'],
      });
      expect(result).toEqual(mockOrganization);
    });

    it('should return null when no user', async () => {
      currentDbUserService.getCurrentDbUser.mockResolvedValue(null);

      const result = await service.getCurrentOrganization();

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(organizationRepository.findOne).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null when user has no logged organization', async () => {
      const userWithoutOrg = createMockUser({ loggedOrganizationId: null });
      currentDbUserService.getCurrentDbUser.mockResolvedValue(userWithoutOrg);

      const result = await service.getCurrentOrganization();

      expect(currentDbUserService.getCurrentDbUser).toHaveBeenCalledTimes(1);
      expect(organizationRepository.findOne).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
