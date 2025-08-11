import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesChannel } from '../../../../database/entities/sales-channel.entity';
import { Organization } from '../../../../database/entities/organization.entity';
import { CreateSalesChannelDto } from '../../dto/create-sales-channel.dto';
import * as crypto from 'crypto';

//-------------------------------------------

@Injectable()
export class CreateNewChannelService {
  constructor(
    @InjectRepository(SalesChannel)
    private salesChannelsRepository: Repository<SalesChannel>,
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>
  ) {}

  //----------------------------------------
  async createNewSalesChannel(
    createSalesChannelDto: CreateSalesChannelDto
  ): Promise<SalesChannel> {
    // Find organization by ID (as specified in DTO)
    const organization = await this.organizationsRepository.findOne({
      where: { id: createSalesChannelDto.organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const salesChannel = this.salesChannelsRepository.create({
      uuid: crypto.randomUUID(),
      name: createSalesChannelDto.name,
      description: createSalesChannelDto.description,
      organizationId: organization.id,
    });

    return this.salesChannelsRepository.save(salesChannel);
  }
}
