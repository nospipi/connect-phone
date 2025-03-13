/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { BlankUserDto } from './dto/create-user.dto';
import { RequestContextService } from '../core/request-context.service';
import { User, Organization } from '../db.module';

//----------------------------------------------------

describe('UsersService - createBlankUser', () => {
  let service: UsersService;
  let mockDb: {
    createBlankUser: jest.Mock;
  };
  let mockRequestContextService: { getEmail: jest.Mock };

  const mockUser: Partial<User> = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    // Create mocks
    mockDb = {
      createBlankUser: jest.fn(),
    };

    mockRequestContextService = {
      getEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'DB',
          useValue: mockDb,
        },
        {
          provide: RequestContextService,
          useValue: mockRequestContextService,
        },
      ],
    }).compile();

    // Get service instance
    service = module.get<UsersService>(UsersService);

    // Spy on console.log to prevent cluttering test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a blank user successfully', async () => {
    // Arrange
    const createBlankUserDto: BlankUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    };
    mockDb.createBlankUser.mockResolvedValue(mockUser as never);

    // Act
    const result = await service.createBlankUser(createBlankUserDto);

    // Assert
    expect(mockDb.createBlankUser).toHaveBeenCalledWith(createBlankUserDto);
    expect(mockDb.createBlankUser).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUser);
    expect(console.log).toHaveBeenCalledWith(
      'Creating blank user:',
      createBlankUserDto
    );
    expect(console.log).toHaveBeenCalledWith('newBlankUser:', mockUser);
  });
});

//-----------------------------------------------------------------

describe('UsersService - isLoggedUserInDb', () => {
  let service: UsersService;
  let mockDb: { getUserByEmail: jest.Mock };
  let mockRequestContextService: { getEmail: jest.Mock };

  const mockUser: Partial<User> = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    // Create mocks
    mockDb = {
      getUserByEmail: jest.fn(),
    };

    mockRequestContextService = {
      getEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'DB',
          useValue: mockDb,
        },
        {
          provide: RequestContextService,
          useValue: mockRequestContextService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should return true when email exists in the database', async () => {
    // Arrange
    const email = 'john.doe@example.com';
    mockRequestContextService.getEmail.mockReturnValue(email);
    mockDb.getUserByEmail.mockResolvedValue(mockUser);

    // Act
    const result = await service.isLoggedUserInDb();

    // Assert
    expect(mockRequestContextService.getEmail).toHaveBeenCalled();
    expect(mockDb.getUserByEmail).toHaveBeenCalledWith(email);
    expect(result).toEqual(true);
  });

  it('should return null when user is not found in the database', async () => {
    // Arrange
    const email = 'unknown@example.com';
    mockRequestContextService.getEmail.mockReturnValue(email);
    mockDb.getUserByEmail.mockResolvedValue(null);

    // Act
    const result = await service.isLoggedUserInDb();

    // Assert
    expect(mockRequestContextService.getEmail).toHaveBeenCalled();
    expect(mockDb.getUserByEmail).toHaveBeenCalledWith(email);
    expect(result).toBeNull();
  });

  it('should handle null email from request context', async () => {
    // Arrange
    mockRequestContextService.getEmail.mockReturnValue(null);
    mockDb.getUserByEmail.mockResolvedValue(null);

    // Act
    const result = await service.isLoggedUserInDb();

    // Assert
    expect(mockRequestContextService.getEmail).toHaveBeenCalled();
    expect(mockDb.getUserByEmail).toHaveBeenCalledWith('');
    expect(result).toBeNull();
  });

  it('should handle empty email from request context', async () => {
    // Arrange
    mockRequestContextService.getEmail.mockReturnValue('');
    mockDb.getUserByEmail.mockResolvedValue(null);

    // Act
    const result = await service.isLoggedUserInDb();

    // Assert
    expect(mockRequestContextService.getEmail).toHaveBeenCalled();
    expect(mockDb.getUserByEmail).toHaveBeenCalledWith('');
    expect(result).toBeNull();
  });

  it('should propagate database errors', async () => {
    // Arrange
    const email = 'john.doe@example.com';
    const dbError = new Error('Database connection failed');

    mockRequestContextService.getEmail.mockReturnValue(email);
    mockDb.getUserByEmail.mockRejectedValue(dbError);

    // Act & Assert
    await expect(service.isLoggedUserInDb()).rejects.toThrow(dbError);
    expect(mockRequestContextService.getEmail).toHaveBeenCalled();
    expect(mockDb.getUserByEmail).toHaveBeenCalledWith(email);
  });
});

describe('UsersService - getLoggedUserFromDb', () => {
  let service: UsersService;
  let mockDb: { getUserByEmail: jest.Mock };
  let mockRequestContextService: { getEmail: jest.Mock };

  const mockUser: Partial<User> = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    // Create mocks
    mockDb = {
      getUserByEmail: jest.fn(),
    };

    mockRequestContextService = {
      getEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'DB',
          useValue: mockDb,
        },
        {
          provide: RequestContextService,
          useValue: mockRequestContextService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should return user when email exists in database', async () => {
    // Arrange
    const email = 'john.doe@example.com';
    mockRequestContextService.getEmail.mockReturnValue(email);
    mockDb.getUserByEmail.mockResolvedValue(mockUser);

    // Act
    const result = await service.getLoggedUserFromDb();

    // Assert
    expect(mockRequestContextService.getEmail).toHaveBeenCalled();
    expect(mockDb.getUserByEmail).toHaveBeenCalledWith(email);
    expect(result).toEqual(mockUser);
  });

  it('should return null when user not found in database', async () => {
    // Arrange
    const email = 'nonexistent@example.com';
    mockRequestContextService.getEmail.mockReturnValue(email);
    mockDb.getUserByEmail.mockResolvedValue(null);

    // Act
    const result = await service.getLoggedUserFromDb();

    // Assert
    expect(mockRequestContextService.getEmail).toHaveBeenCalled();
    expect(mockDb.getUserByEmail).toHaveBeenCalledWith(email);
    expect(result).toBeNull();
  });

  it('should handle null email from request context', async () => {
    // Arrange
    mockRequestContextService.getEmail.mockReturnValue(null);
    mockDb.getUserByEmail.mockResolvedValue(null);

    // Act
    const result = await service.getLoggedUserFromDb();

    // Assert
    expect(mockRequestContextService.getEmail).toHaveBeenCalled();
    expect(mockDb.getUserByEmail).toHaveBeenCalledWith('');
    expect(result).toBeNull();
  });

  it('should handle empty email from request context', async () => {
    // Arrange
    mockRequestContextService.getEmail.mockReturnValue('');
    mockDb.getUserByEmail.mockResolvedValue(null);

    // Act
    const result = await service.getLoggedUserFromDb();

    // Assert
    expect(mockRequestContextService.getEmail).toHaveBeenCalled();
    expect(mockDb.getUserByEmail).toHaveBeenCalledWith('');
    expect(result).toBeNull();
  });

  it('should propagate database errors', async () => {
    // Arrange
    const email = 'john.doe@example.com';
    const dbError = new Error('Database connection failed');

    mockRequestContextService.getEmail.mockReturnValue(email);
    mockDb.getUserByEmail.mockRejectedValue(dbError);

    // Act & Assert
    await expect(service.getLoggedUserFromDb()).rejects.toThrow(dbError);
    expect(mockRequestContextService.getEmail).toHaveBeenCalled();
    expect(mockDb.getUserByEmail).toHaveBeenCalledWith(email);
  });
});

describe('OrganizationService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'DB',
          useValue: {},
        },
        {
          provide: RequestContextService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserOrganization', () => {
    it('should fetch organization by ID', async () => {
      // Arrange
      const organizationId = 1;
      const mockOrganization = {
        id: organizationId,
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: new Date(),
        name: 'Test Organization',
        slug: 'test-organization',
        logoUrl: 'https://example.com/logo.png',
      };

      // Create a module with properly mocked dependencies
      const mockDb = {
        getOrganizationById: jest.fn().mockResolvedValue(mockOrganization),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UsersService,
          {
            provide: 'DB',
            useValue: mockDb,
          },
          {
            provide: RequestContextService,
            useValue: {},
          },
        ],
      }).compile();

      const service = module.get<UsersService>(UsersService);

      // Act
      const result = await service.getUserOrganization(mockOrganization);

      // Assert
      expect(mockDb.getOrganizationById).toHaveBeenCalledWith(
        organizationId || 0
      );
      expect(result).toEqual(mockOrganization);
    });
  });
});
