import { describe, beforeEach, it } from 'node:test';
import { expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { HttpException } from '@nestjs/common';
import { BlankUserDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestContextService } from '../core/request-context.service';

describe('UsersService', () => {
  let service: UsersService;
  let mockDb;
  let mockRequestContextService;

  const mockUser = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    createdAt: new Date(),
  };

  const mockUsers = [
    mockUser,
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      createdAt: new Date(),
    },
  ];

  beforeEach(async () => {
    // Create mocks with Jest
    mockDb = {
      getAllUsers: jest.fn(),
      getUserByEmail: jest.fn(),
      createBlankUser: jest.fn(),
    };

    mockRequestContextService = {
      getEmail: jest.fn(),
    };

    // Use NestJS Test utility to create a testing module
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

    // Get the service from the testing module
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBlankUser', () => {
    it('should create a blank user successfully', async () => {
      const createBlankUserDto: BlankUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      mockDb.createBlankUser.mockResolvedValue(mockUser);

      const result = await service.createBlankUser(createBlankUserDto);

      expect(mockDb.createBlankUser).toHaveBeenCalledWith(createBlankUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw HttpException when createBlankUser fails', async () => {
      const createBlankUserDto: BlankUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      const error = new Error('Database error');
      mockDb.createBlankUser.mockRejectedValue(error);

      await expect(service.createBlankUser(createBlankUserDto)).rejects.toThrow(
        HttpException
      );
      expect(mockDb.createBlankUser).toHaveBeenCalledWith(createBlankUserDto);
    });

    it('should handle error with detail property', async () => {
      const createBlankUserDto: BlankUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      const errorWithDetail = { detail: 'Duplicate email' };
      mockDb.createBlankUser.mockRejectedValue(errorWithDetail);

      let thrownError;
      try {
        await service.createBlankUser(createBlankUserDto);
      } catch (error) {
        thrownError = error;
      }

      expect(thrownError).toBeInstanceOf(HttpException);
      expect(thrownError.message).toBe('Duplicate email');
    });
  });

  describe('create', () => {
    it('should return success message when user is created', async () => {
      // Spy on console.log to suppress logs during tests
      jest.spyOn(console, 'log').mockImplementation(() => {});

      const createUserDto: CreateUserDto = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        createdAt: new Date(),
      };

      const result = await service.create(createUserDto);

      expect(result).toBe('User created');
    });

    it('should handle errors during user creation', async () => {
      // Spy on console.log to suppress logs during tests
      jest.spyOn(console, 'log').mockImplementation(() => {});

      // Mock Promise.resolve to reject
      const originalPromiseResolve = Promise.resolve;
      global.Promise.resolve = jest.fn().mockImplementationOnce(() => {
        return Promise.reject(new Error('Test error'));
      });

      const createUserDto: CreateUserDto = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        createdAt: new Date(),
      };

      await expect(service.create(createUserDto)).rejects.toThrow();

      // Restore original Promise.resolve
      global.Promise.resolve = originalPromiseResolve;
    });
  });

  describe('isLoggedUserInDb', () => {
    it('should return user when user is found by email', async () => {
      mockRequestContextService.getEmail.mockReturnValue('john@example.com');
      mockDb.getUserByEmail.mockResolvedValue(mockUser);

      const result = await service.isLoggedUserInDb();

      expect(mockRequestContextService.getEmail).toHaveBeenCalled();
      expect(mockDb.getUserByEmail).toHaveBeenCalledWith('john@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found by email', async () => {
      mockRequestContextService.getEmail.mockReturnValue('john@example.com');
      mockDb.getUserByEmail.mockResolvedValue(null);

      const result = await service.isLoggedUserInDb();

      expect(mockRequestContextService.getEmail).toHaveBeenCalled();
      expect(mockDb.getUserByEmail).toHaveBeenCalledWith('john@example.com');
      expect(result).toBeNull();
    });

    it('should handle case when email is null', async () => {
      mockRequestContextService.getEmail.mockReturnValue(null);
      mockDb.getUserByEmail.mockResolvedValue(null);

      const result = await service.isLoggedUserInDb();

      expect(mockRequestContextService.getEmail).toHaveBeenCalled();
      expect(mockDb.getUserByEmail).toHaveBeenCalledWith('');
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      mockRequestContextService.getEmail.mockReturnValue('john@example.com');
      mockDb.getAllUsers.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(mockRequestContextService.getEmail).toHaveBeenCalled();
      expect(mockDb.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });

    it('should handle empty user list', async () => {
      mockRequestContextService.getEmail.mockReturnValue('john@example.com');
      mockDb.getAllUsers.mockResolvedValue([]);

      const result = await service.findAll();

      expect(mockRequestContextService.getEmail).toHaveBeenCalled();
      expect(mockDb.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should propagate errors from getAllUsers', async () => {
      mockRequestContextService.getEmail.mockReturnValue('john@example.com');
      const error = new Error('Database error');
      mockDb.getAllUsers.mockRejectedValue(error);

      await expect(service.findAll()).rejects.toThrow('Database error');
      expect(mockRequestContextService.getEmail).toHaveBeenCalled();
      expect(mockDb.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a string with the user id', () => {
      const result = service.findOne(1);
      expect(result).toBe('This action returns a #1 user');
    });
  });

  describe('update', () => {
    it('should return a string with the user id', () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };
      const result = service.update(1, updateUserDto);
      expect(result).toBe('This action updates a #1 user');
    });
  });

  describe('remove', () => {
    it('should return a string with the user id', () => {
      const result = service.remove(1);
      expect(result).toBe('This action removes a #1 user');
    });
  });
});
