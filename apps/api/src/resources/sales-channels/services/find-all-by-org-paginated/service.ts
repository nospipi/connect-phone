import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesChannel } from '../../../../database/entities/sales-channel.entity';
import { Organization } from '../../../../database/entities/organization.entity';
// import { CreateSalesChannelDto } from './dto/create-sales-channel.dto';
// import { UpdateSalesChannelDto } from './dto/update-sales-channel.dto';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

//-----------------------------------------

@Injectable()
export class FindAllByOrgPaginatedService {
  constructor(
    @InjectRepository(SalesChannel)
    private salesChannelsRepository: Repository<SalesChannel>,
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>
  ) {}

  //----------------------------------------
  async findAllByOrganizationPaginated(
    organizationId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<Pagination<SalesChannel>> {
    // Verify organization exists
    const organization = await this.organizationsRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Configure pagination options
    const options: IPaginationOptions = {
      page,
      limit: Math.min(Math.max(limit, 1), 100), // Validate limit bounds
      route: `/sales-channels/organization/${organizationId}/paginated`, // Optional: for generating pagination links
    };

    // Build query
    const queryBuilder = this.salesChannelsRepository
      .createQueryBuilder('salesChannel')
      .leftJoinAndSelect('salesChannel.organization', 'organization')
      .where('salesChannel.organizationId = :organizationId', {
        organizationId,
      })
      .orderBy('salesChannel.id', 'DESC'); // Order by ID descending

    // Use nestjs-typeorm-paginate to handle pagination
    return paginate<SalesChannel>(queryBuilder, options);
  }
}
