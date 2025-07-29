import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SalesChannelsService } from './sales-channels.service';
import { CreateSalesChannelDto } from './dto/create-sales-channel.dto';
import { UpdateSalesChannelDto } from './dto/update-sales-channel.dto';

@Controller('sales-channels')
export class SalesChannelsController {
  constructor(private readonly salesChannelsService: SalesChannelsService) {}

  @Post()
  create(@Body() createSalesChannelDto: CreateSalesChannelDto) {
    return this.salesChannelsService.create(createSalesChannelDto);
  }

  @Get()
  findAll() {
    return this.salesChannelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesChannelsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalesChannelDto: UpdateSalesChannelDto) {
    return this.salesChannelsService.update(+id, updateSalesChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesChannelsService.remove(+id);
  }
}
