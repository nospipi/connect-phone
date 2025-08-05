// src/resources/sales-channels/sales-channels.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { SalesChannelsService } from './sales-channels.service';
import { SalesChannel } from '../../database/entities/sales-channel.entity';
import { CreateSalesChannelDto } from './dto/create-sales-channel.dto';
import { UpdateSalesChannelDto } from './dto/update-sales-channel.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Public } from 'src/common/guards/decorators/public.decorator';

@Controller('sales-channels')
export class SalesChannelsController {
  constructor(private readonly salesChannelsService: SalesChannelsService) {}

  //---------------------------------------
  @Post()
  async create(
    @Body() createSalesChannelDto: CreateSalesChannelDto
  ): Promise<SalesChannel> {
    return this.salesChannelsService.create(createSalesChannelDto);
  }

  //---------------------------------------
  @Get()
  async findAll(): Promise<SalesChannel[]> {
    return this.salesChannelsService.findAll();
  }

  //---------------------------------------
  //@Public()
  @Get('organization/:organizationId')
  async findAllByOrganization(
    @Param('organizationId', ParseIntPipe) organizationId: number
  ): Promise<SalesChannel[]> {
    console.log('Fetching sales channels for organization:', organizationId);
    return this.salesChannelsService.findAllByOrganization(organizationId);
  }

  //---------------------------------------
  //@Public()
  @Get('organization/:organizationId/paginated')
  async findAllByOrganizationPaginated(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<SalesChannel>> {
    console.log(
      'Fetching paginated sales channels for organization:',
      organizationId,
      'page:',
      page,
      'limit:',
      limit
    );
    return this.salesChannelsService.findAllByOrganizationPaginated(
      organizationId,
      page,
      limit
    );
  }
  //---------------------------------------
  //@Public()
  @Get('create-random')
  async createRandom(): Promise<SalesChannel> {
    console.log('Creating a random sales channel...');
    const newSalesChannel =
      await this.salesChannelsService.createRandomSalesChannel();
    console.log('Random sales channel created:', newSalesChannel);
    return newSalesChannel;
  }

  //---------------------------------------
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<SalesChannel> {
    return this.salesChannelsService.findOne(id);
  }

  //---------------------------------------
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSalesChannelDto: UpdateSalesChannelDto
  ): Promise<SalesChannel> {
    return this.salesChannelsService.update(id, updateSalesChannelDto);
  }

  //---------------------------------------
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.salesChannelsService.remove(id);
  }
}
