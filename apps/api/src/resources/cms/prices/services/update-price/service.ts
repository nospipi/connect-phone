// apps/api/src/resources/prices/services/update-price/service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceEntity } from '@/database/entities/price.entity';
import { DateRangeEntity } from '@/database/entities/date-range.entity';
import { SalesChannelEntity } from '@/database/entities/sales-channel.entity';
import { UpdatePriceDto } from './update-price.dto';
import { IPrice } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class UpdatePriceService {
  constructor(
    @InjectRepository(PriceEntity)
    private priceRepository: Repository<PriceEntity>,
    @InjectRepository(DateRangeEntity)
    private dateRangeRepository: Repository<DateRangeEntity>,
    @InjectRepository(SalesChannelEntity)
    private salesChannelRepository: Repository<SalesChannelEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async updatePrice(updatePriceDto: UpdatePriceDto): Promise<IPrice> {
    if (!updatePriceDto.id) {
      throw new NotFoundException('Price ID is required');
    }

    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    if (!organization) {
      throw new ForbiddenException('Organization context required');
    }

    const price = await this.priceRepository.findOne({
      where: {
        id: updatePriceDto.id,
        organizationId: organization.id,
      },
      relations: ['dateRanges', 'salesChannels'],
    });

    if (!price) {
      throw new NotFoundException(
        `Price with ID ${updatePriceDto.id} not found in current organization`
      );
    }

    if (updatePriceDto.name !== undefined) {
      price.name = updatePriceDto.name;
    }
    if (updatePriceDto.amount !== undefined) {
      price.amount = updatePriceDto.amount;
    }
    if (updatePriceDto.currency !== undefined) {
      price.currency = updatePriceDto.currency;
    }
    if (updatePriceDto.isDateBased !== undefined) {
      price.isDateBased = updatePriceDto.isDateBased;
    }

    await this.priceRepository.save(price);

    if (updatePriceDto.dateRangeIds !== undefined) {
      const currentDateRanges = price.dateRanges || [];

      if (updatePriceDto.dateRangeIds.length > 0) {
        const newDateRanges = await this.dateRangeRepository.findByIds(
          updatePriceDto.dateRangeIds
        );
        await this.priceRepository
          .createQueryBuilder()
          .relation(PriceEntity, 'dateRanges')
          .of(price)
          .addAndRemove(newDateRanges, currentDateRanges);
      } else {
        await this.priceRepository
          .createQueryBuilder()
          .relation(PriceEntity, 'dateRanges')
          .of(price)
          .remove(currentDateRanges);
      }
    }

    if (updatePriceDto.salesChannelIds !== undefined) {
      const currentSalesChannels = price.salesChannels || [];

      if (updatePriceDto.salesChannelIds.length > 0) {
        const newSalesChannels = await this.salesChannelRepository.findByIds(
          updatePriceDto.salesChannelIds
        );
        await this.priceRepository
          .createQueryBuilder()
          .relation(PriceEntity, 'salesChannels')
          .of(price)
          .addAndRemove(newSalesChannels, currentSalesChannels);
      } else {
        await this.priceRepository
          .createQueryBuilder()
          .relation(PriceEntity, 'salesChannels')
          .of(price)
          .remove(currentSalesChannels);
      }
    }

    const priceWithRelations = await this.priceRepository.findOne({
      where: { id: price.id },
      relations: ['organization', 'dateRanges', 'salesChannels'],
    });

    if (!priceWithRelations) {
      throw new NotFoundException('Price not found after update');
    }

    return priceWithRelations;
  }
}
