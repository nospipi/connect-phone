import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesChannel } from '../../database/entities/sales-channel.entity';

@Injectable()
export class SalesChannelsService {
  constructor(
    @InjectRepository(SalesChannel)
    private salesChannelsRepository: Repository<SalesChannel>
  ) {}

  async findAllByOrganization(organizationId: number): Promise<SalesChannel[]> {
    return this.salesChannelsRepository.find({
      where: { organizationId },
      relations: ['organization'],
    });
  }
}
