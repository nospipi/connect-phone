import { describe, beforeEach, afterEach, it } from 'node:test';
import { expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { HttpException } from '@nestjs/common';
import { BlankUserDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestContextService } from '../core/request-context.service';
import { User } from '../db.module';

describe('UsersService - createBlankUser', () => {
  let service: UsersService;
  let mockDb: {
    createBlankUser: jest.Mock;
  };
  let mockRequestContextService: { getEmail: jest.Mock };

  const mockUser = {
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
