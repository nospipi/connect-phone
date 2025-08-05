import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesChannel } from '../../database/entities/sales-channel.entity';
import { Organization } from '../../database/entities/organization.entity';
import { CreateSalesChannelDto } from './dto/create-sales-channel.dto';
import { UpdateSalesChannelDto } from './dto/update-sales-channel.dto';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { faker } from '@faker-js/faker';
import * as crypto from 'crypto';

@Injectable()
export class SalesChannelsService {
  constructor(
    @InjectRepository(SalesChannel)
    private salesChannelsRepository: Repository<SalesChannel>,
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>
  ) {}

  //----------------------------------------
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

  //----------------------------------------
  async findAll(): Promise<SalesChannel[]> {
    return this.salesChannelsRepository.find({
      relations: ['organization'],
    });
  }

  //----------------------------------------
  async findAllByOrganization(organizationId: number): Promise<SalesChannel[]> {
    return this.salesChannelsRepository.find({
      where: { organizationId },
      relations: ['organization'],
    });
  }

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

  //----------------------------------------
  async createRandomSalesChannel(): Promise<SalesChannel> {
    const organization = await this.organizationsRepository.findOne({
      where: { id: 31 }, // Assuming organization with ID 1 exists
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

  //----------------------------------------
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

  //----------------------------------------
  async update(
    id: number,
    updateSalesChannelDto: UpdateSalesChannelDto
  ): Promise<SalesChannel> {
    const salesChannel = await this.findOne(id);

    Object.assign(salesChannel, updateSalesChannelDto);

    return this.salesChannelsRepository.save(salesChannel);
  }

  //----------------------------------------
  async remove(id: number): Promise<void> {
    const salesChannel = await this.findOne(id);
    await this.salesChannelsRepository.remove(salesChannel);
  }
}
