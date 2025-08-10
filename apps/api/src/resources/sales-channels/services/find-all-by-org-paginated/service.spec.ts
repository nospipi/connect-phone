import { NotFoundException } from '@nestjs/common';
import { FindAllByOrgPaginatedService } from './service';
import { paginate } from 'nestjs-typeorm-paginate';

//------------------------------------------

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

describe('FindAllByOrgPaginatedService', () => {
  let service: FindAllByOrgPaginatedService;
  let salesChannelsRepository: any;
  let organizationsRepository: any;

  beforeEach(() => {
    salesChannelsRepository = {
      createQueryBuilder: jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
      }),
    };
    organizationsRepository = {
      findOne: jest.fn(),
    };
    service = new FindAllByOrgPaginatedService(
      salesChannelsRepository,
      organizationsRepository
    );
  });

  it('should throw NotFoundException if organization does not exist', async () => {
    organizationsRepository.findOne.mockResolvedValue(null);

    await expect(
      service.findAllByOrganizationPaginated(1, 1, 10)
    ).rejects.toThrow(NotFoundException);
  });

  it('should call paginate if organization exists', async () => {
    organizationsRepository.findOne.mockResolvedValue({ id: 1 });
    (paginate as jest.Mock).mockResolvedValue('paginated-result');

    const result = await service.findAllByOrganizationPaginated(1, 1, 10);

    expect(paginate).toHaveBeenCalled();
    expect(result).toBe('paginated-result');
  });
});
