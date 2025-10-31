// apps/api/src/resources/prices/services/create-price/service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceEntity } from '@/database/entities/price.entity';
import { DateRangeEntity } from '@/database/entities/date-range.entity';
import { SalesChannelEntity } from '@/database/entities/sales-channel.entity';
import { CreatePriceDto } from './create-price.dto';
import { IPrice } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class CreatePriceService {
  constructor(
    @InjectRepository(PriceEntity)
    private priceRepository: Repository<PriceEntity>,
    @InjectRepository(DateRangeEntity)
    private dateRangeRepository: Repository<DateRangeEntity>,
    @InjectRepository(SalesChannelEntity)
    private salesChannelRepository: Repository<SalesChannelEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async createPrice(createPriceDto: CreatePriceDto): Promise<IPrice> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    const price = this.priceRepository.create({
      name: createPriceDto.name,
      amount: createPriceDto.amount,
      currency: createPriceDto.currency,
      isDateBased: createPriceDto.isDateBased,
      organizationId: organization?.id,
    });

    const savedPrice = await this.priceRepository.save(price);

    if (createPriceDto.isDateBased && createPriceDto.dateRangeIds?.length > 0) {
      const dateRanges = await this.dateRangeRepository.findByIds(
        createPriceDto.dateRangeIds
      );
      await this.priceRepository
        .createQueryBuilder()
        .relation(PriceEntity, 'dateRanges')
        .of(savedPrice)
        .add(dateRanges);
    }

    if (createPriceDto.salesChannelIds?.length > 0) {
      const salesChannels = await this.salesChannelRepository.findByIds(
        createPriceDto.salesChannelIds
      );
      await this.priceRepository
        .createQueryBuilder()
        .relation(PriceEntity, 'salesChannels')
        .of(savedPrice)
        .add(salesChannels);
    }

    const priceWithRelations = await this.priceRepository.findOne({
      where: { id: savedPrice.id },
      relations: ['organization', 'dateRanges', 'salesChannels'],
    });

    if (!priceWithRelations) {
      throw new NotFoundException('Price not found after creation');
    }

    return priceWithRelations;
  }
}
