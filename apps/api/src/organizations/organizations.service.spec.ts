import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsService } from './organizations.service';
import {
  CreateOrganizationDto,
  AddUrlDto,
} from './dto/create-organization.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('OrganizationsService', () => {
  let service: OrganizationsService;
  let mockDb: { createOrganization: jest.Mock };

  beforeEach(async () => {
    // Create mock DB
    mockDb = {
      createOrganization: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        {
          provide: 'DB',
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);

    // Mock console.log to avoid cluttering test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('create', () => {
    it('should create an organization successfully', async () => {
      // Arrange
      const createOrganizationDto: CreateOrganizationDto = {
        name: 'Test Organization',
        slug: 'test-organization',
      };

      const mockOrganization = {
        id: 1,
        name: 'Test Organization',
        slug: 'test-organization',
        createdAt: new Date(),
      };

      mockDb.createOrganization.mockResolvedValue(mockOrganization);

      // Act
      const result = await service.create(createOrganizationDto);

      // Assert
      expect(mockDb.createOrganization).toHaveBeenCalledWith(
        createOrganizationDto
      );
      expect(result).toEqual(mockOrganization);
    });

    it('should throw HttpException when creation fails', async () => {
      // Arrange
      const createOrganizationDto: CreateOrganizationDto = {
        name: 'Test Organization',
        slug: 'test-organization',
      };

      const error = new Error('Database error');
      mockDb.createOrganization.mockRejectedValue(error);

      // Act & Assert
      await expect(service.create(createOrganizationDto)).rejects.toThrow(
        new HttpException('Database error', HttpStatus.BAD_REQUEST)
      );
    });
  });

  describe('OrganizationsService - addLogoUrlToOrganization', () => {
    let service: OrganizationsService;
    let mockDb: { addLogoUrlToOrganization: jest.Mock };

    beforeEach(async () => {
      // Create mock DB
      mockDb = {
        addLogoUrlToOrganization: jest.fn(),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          OrganizationsService,
          {
            provide: 'DB',
            useValue: mockDb,
          },
        ],
      }).compile();

      service = module.get<OrganizationsService>(OrganizationsService);

      // Mock console.log to avoid cluttering test output
      jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return true when logo URL is successfully added', async () => {
      // Arrange
      const addUrlDto: AddUrlDto = {
        id: '1',
        logoUrl: 'https://example.com/logo.png',
      };
      mockDb.addLogoUrlToOrganization.mockResolvedValue(true);

      // Act
      const result = await service.addLogoUrlToOrganization(addUrlDto);

      // Assert
      expect(mockDb.addLogoUrlToOrganization).toHaveBeenCalledWith(addUrlDto);
      expect(result).toBe(true);
      expect(console.log).toHaveBeenCalledWith(
        'Adding logo URL to organization:',
        addUrlDto
      );
    });

    it('should return false when operation returns falsy value', async () => {
      // Arrange
      const addUrlDto: AddUrlDto = {
        id: '1',
        logoUrl: 'https://example.com/logo.png',
      };
      mockDb.addLogoUrlToOrganization.mockResolvedValue(false);

      // Act
      const result = await service.addLogoUrlToOrganization(addUrlDto);

      // Assert
      expect(mockDb.addLogoUrlToOrganization).toHaveBeenCalledWith(addUrlDto);
      expect(result).toBe(false);
    });

    it('should return false when operation returns null', async () => {
      // Arrange
      const addUrlDto: AddUrlDto = {
        id: '1',
        logoUrl: 'https://example.com/logo.png',
      };
      mockDb.addLogoUrlToOrganization.mockResolvedValue(null);

      // Act
      const result = await service.addLogoUrlToOrganization(addUrlDto);

      // Assert
      expect(mockDb.addLogoUrlToOrganization).toHaveBeenCalledWith(addUrlDto);
      expect(result).toBe(false);
    });

    it('should throw HttpException with error message when Error is thrown', async () => {
      // Arrange
      const addUrlDto: AddUrlDto = {
        id: '1',
        logoUrl: 'https://example.com/logo.png',
      };
      const errorMessage = 'Database error';
      mockDb.addLogoUrlToOrganization.mockRejectedValue(
        new Error(errorMessage)
      );

      // Act & Assert
      await expect(service.addLogoUrlToOrganization(addUrlDto)).rejects.toThrow(
        new HttpException(errorMessage, HttpStatus.BAD_REQUEST)
      );
      expect(mockDb.addLogoUrlToOrganization).toHaveBeenCalledWith(addUrlDto);
    });

    it('should throw HttpException with detail property when available', async () => {
      // Arrange
      const addUrlDto: AddUrlDto = {
        id: '1',
        logoUrl: 'https://example.com/logo.png',
      };
      const detailMessage = 'Organization not found';
      mockDb.addLogoUrlToOrganization.mockRejectedValue({
        detail: detailMessage,
      });

      // Act & Assert
      await expect(service.addLogoUrlToOrganization(addUrlDto)).rejects.toThrow(
        new HttpException(detailMessage, HttpStatus.BAD_REQUEST)
      );
      expect(mockDb.addLogoUrlToOrganization).toHaveBeenCalledWith(addUrlDto);
    });

    it('should throw HttpException with default message for unknown error types', async () => {
      // Arrange
      const addUrlDto: AddUrlDto = {
        id: '1',
        logoUrl: 'https://example.com/logo.png',
      };
      mockDb.addLogoUrlToOrganization.mockRejectedValue('Unexpected error');

      // Act & Assert
      await expect(service.addLogoUrlToOrganization(addUrlDto)).rejects.toThrow(
        new HttpException(
          'An error occurred while adding the logo URL',
          HttpStatus.BAD_REQUEST
        )
      );
      expect(mockDb.addLogoUrlToOrganization).toHaveBeenCalledWith(addUrlDto);
    });
  });
});
