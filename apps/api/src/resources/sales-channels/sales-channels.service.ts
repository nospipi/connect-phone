import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesChannel } from '../../database/entities/sales-channel.entity';
import { Organization } from '../../database/entities/organization.entity';
import { CreateSalesChannelDto } from './dto/create-sales-channel.dto';
import { UpdateSalesChannelDto } from './dto/update-sales-channel.dto';
import * as crypto from 'crypto';

@Injectable()
export class SalesChannelsService {
  constructor(
    @InjectRepository(SalesChannel)
    private salesChannelsRepository: Repository<SalesChannel>,
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>
  ) {}

  async create(
    createSalesChannelDto: CreateSalesChannelDto
  ): Promise<SalesChannel> {
    // Find organization by UUID
    const organization = await this.organizationsRepository.findOne({
      where: { uuid: createSalesChannelDto.organizationUuid },
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

  async findAll(): Promise<SalesChannel[]> {
    return this.salesChannelsRepository.find({
      relations: ['organization'],
    });
  }

  async findAllByOrganization(organizationId: number): Promise<SalesChannel[]> {
    return this.salesChannelsRepository.find({
      where: { organizationId },
      relations: ['organization'],
    });
  }

  async findOne(id: number): Promise<SalesChannel> {
    const salesChannel = await this.salesChannelsRepository.findOne({
      where: { id },
      relations: ['organization'],
    });

    if (!salesChannel) {
      throw new NotFoundException('Sales channel not found');
    }

    return salesChannel;
  }

  async update(
    id: number,
    updateSalesChannelDto: UpdateSalesChannelDto
  ): Promise<SalesChannel> {
    const salesChannel = await this.findOne(id);

    Object.assign(salesChannel, updateSalesChannelDto);

    return this.salesChannelsRepository.save(salesChannel);
  }

  async remove(id: number): Promise<void> {
    const salesChannel = await this.findOne(id);
    await this.salesChannelsRepository.remove(salesChannel);
  }
}
