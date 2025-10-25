// apps/api/src/resources/prices/services/get-price-by-id/service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceEntity } from '../../../../database/entities/price.entity';
import { IPrice } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '../../../../common/services/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class GetPriceByIdService {
  constructor(
    @InjectRepository(PriceEntity)
    private priceRepository: Repository<PriceEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async getPriceById(priceId: number): Promise<IPrice> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    if (!organization) {
      throw new ForbiddenException('Organization context required');
    }

    const price = await this.priceRepository.findOne({
      where: {
        id: priceId,
        organizationId: organization.id,
      },
      relations: ['organization', 'dateRanges', 'salesChannels'],
    });

    if (!price) {
      throw new NotFoundException(
        `Price with ID ${priceId} not found in current organization`
      );
    }

    return price;
  }
}
