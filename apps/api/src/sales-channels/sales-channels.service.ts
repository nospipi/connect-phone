import { Injectable, Inject } from '@nestjs/common';
import { CreateSalesChannelDto } from './dto/create-sales-channel.dto';
import { UpdateSalesChannelDto } from './dto/update-sales-channel.dto';
import { SalesChannel } from '../db.module';

//------------------------------------------------------------------------

interface DbQueries {
  getSalesChannelsOfOrganizationPaginated(
    organizationId?: number,
    cursor?: number,
    pageSize?: number
  ): Promise<SalesChannel[]>;
}

@Injectable()
export class SalesChannelsService {
  constructor(@Inject('DB') private readonly db: DbQueries) {}

  async getSalesChannelsOfOrganizationPaginated(
    organizationId?: number,
    cursor?: number,
    pageSize: number = 10
  ): Promise<SalesChannel[]> {
    try {
      console.log('Getting sales channels for organization:', organizationId, {
        cursor,
        pageSize,
      });

      const salesChannels =
        await this.db.getSalesChannelsOfOrganizationPaginated(
          organizationId,
          cursor,
          pageSize
        );

      console.log('Found sales channels:', salesChannels.length);
      return salesChannels;
    } catch (error: unknown) {
      console.error('Error getting sales channels:', error);
      throw error;
    }
  }

  create(createSalesChannelDto: CreateSalesChannelDto) {
    return 'This action adds a new salesChannel';
  }

  findAll() {
    return `This action returns all salesChannels`;
  }

  findOne(id: number) {
    return `This action returns a #${id} salesChannel`;
  }

  update(id: number, updateSalesChannelDto: UpdateSalesChannelDto) {
    return `This action updates a #${id} salesChannel`;
  }

  remove(id: number) {
    return `This action removes a #${id} salesChannel`;
  }
}
