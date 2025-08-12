import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesChannel } from '../../../../database/entities/sales-channel.entity';
import { Organization } from '../../../../database/entities/organization.entity';
import { CreateSalesChannelDto } from '../create-new-channel/create-sales-channel.dto';
import { faker } from '@faker-js/faker';

//-------------------------------------------

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
    // First, get a random organization to use
    const organizations = await this.organizationsRepository.find();
    if (organizations.length === 0) {
      throw new NotFoundException('No organizations found');
    }

    // Pick a random organization
    const randomOrg =
      organizations[Math.floor(Math.random() * organizations.length)];

    // Create random DTO data
    const createSalesChannelDto: CreateSalesChannelDto = {
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
      organizationId: randomOrg.id,
    };

    return this.createSalesChannel(createSalesChannelDto);
  }

  //----------------------------------------
  async createSalesChannel(
    createSalesChannelDto: CreateSalesChannelDto
  ): Promise<SalesChannel> {
    // Find organization by UUID (as specified in DTO)
    const organization = await this.organizationsRepository.findOne({
      where: { id: createSalesChannelDto.organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const salesChannel = this.salesChannelsRepository.create({
      name: createSalesChannelDto.name,
      description: createSalesChannelDto.description,
      organizationId: organization.id,
    });

    return this.salesChannelsRepository.save(salesChannel);
  }
}
