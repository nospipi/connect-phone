import { Injectable } from '@nestjs/common';
import { CreateSalesChannelDto } from './dto/create-sales-channel.dto';
import { UpdateSalesChannelDto } from './dto/update-sales-channel.dto';

@Injectable()
export class SalesChannelsService {
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
