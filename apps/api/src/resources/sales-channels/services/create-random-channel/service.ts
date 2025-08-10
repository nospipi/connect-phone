import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesChannel } from '@/database/entities/sales-channel.entity';
import { Organization } from '@/database/entities/organization.entity';
import { faker } from '@faker-js/faker';
import * as crypto from 'crypto';

@Injectable()
export class CreateRandomChannelService {
  constructor(
    @InjectRepository(SalesChannel)
    private salesChannelsRepository: Repository<SalesChannel>,
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>
  ) {}

  //----------------------------------------
  async createRandomSalesChannel(): Promise<SalesChannel> {
    const organization = await this.organizationsRepository.findOne({
      where: { id: 31 }, // Assuming organization with ID 31 exists
    });
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    const salesChannel = this.salesChannelsRepository.create({
      uuid: crypto.randomUUID(),
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
      organizationId: organization.id,
    });
    return this.salesChannelsRepository.save(salesChannel);
  }
}
