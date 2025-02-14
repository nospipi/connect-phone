import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getUsers, User } from 'database'; // Import the User type

// Mock the 'database' module
jest.mock('database', () => ({
  getUsers: jest.fn(),
  // Mock other functions as needed (createUser, updateUser, deleteUser, findUserById)
}));

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      // Arrange: Prepare a mock list of users
      const mockUsers: User[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          createdAt: new Date(),
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          createdAt: new Date(),
        },
      ];

      // Mock getUsers to return the mockUsers array
      (getUsers as jest.Mock).mockResolvedValue(mockUsers);

      // Act: Call the findAll method
      const result = await service.findAll();

      // Assert: Check if the result matches the mock data
      expect(result).toEqual(mockUsers);
      // Ensure getUsers was called once
      expect(getUsers).toHaveBeenCalledTimes(1);
    });

    it('should handle no users', async () => {
      (getUsers as jest.Mock).mockResolvedValue([]); // Mock an empty array

      const users = await service.findAll();

      expect(users).toEqual([]); // Expect an empty array
      expect(getUsers).toHaveBeenCalled(); // Check if getUsers was called
    });

    it('should handle errors from getUsers', async () => {
      const errorMessage = 'Database Error';
      (getUsers as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(service.findAll()).rejects.toThrow(errorMessage); // Expect the error to be thrown
      expect(getUsers).toHaveBeenCalled(); // Check if getUsers was called
    });
  });

  // Add tests for other methods (create, findOne, update, remove) in a similar way.
});
