/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { RequestContextService } from '../../common/core/request-context.service';
import { User } from '@clerk/backend';

describe('AuthService', () => {
  let service: AuthService;
  let mockRequestContextService: jest.Mocked<RequestContextService>;

  const mockUser: User = {
    id: 'user_123',
    firstName: 'John',
    lastName: 'Doe',
    primaryEmailAddress: {
      emailAddress: 'john.doe@example.com',
    },
  } as User;

  beforeEach(async () => {
    // Create mock for RequestContextService
    mockRequestContextService = {
      getCurrentUser: jest.fn(),
      getEmail: jest.fn(),
    } as unknown as jest.Mocked<RequestContextService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: RequestContextService,
          useValue: mockRequestContextService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return the current user from the RequestContextService', async () => {
      // Arrange
      mockRequestContextService.getCurrentUser.mockResolvedValue(
        mockUser as never
      );

      // Act
      const result = await service.getProfile();

      // Assert
      expect(mockRequestContextService.getCurrentUser).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUser);
    });

    it('should return null when no user is found', async () => {
      // Arrange
      mockRequestContextService.getCurrentUser.mockResolvedValue(null as never);

      // Act
      const result = await service.getProfile();

      // Assert
      expect(mockRequestContextService.getCurrentUser).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it('should propagate any errors from RequestContextService', async () => {
      // Arrange
      const error = new Error('Failed to get current user');
      mockRequestContextService.getCurrentUser.mockRejectedValue(
        error as never
      );

      // Act & Assert
      await expect(service.getProfile()).rejects.toThrow(error);
      expect(mockRequestContextService.getCurrentUser).toHaveBeenCalledTimes(1);
    });
  });
});
