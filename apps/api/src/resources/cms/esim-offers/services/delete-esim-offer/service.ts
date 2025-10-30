// apps/api/src/resources/esim-offers/services/delete-esim-offer/service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EsimOfferEntity } from '../../../../../database/entities/esim-offer.entity';
import { IEsimOffer } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '../../../../../common/services/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class DeleteEsimOfferService {
  constructor(
    @InjectRepository(EsimOfferEntity)
    private esimOfferRepository: Repository<EsimOfferEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async deleteEsimOffer(esimOfferId: number): Promise<IEsimOffer> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    if (!organization) {
      throw new ForbiddenException('Organization context required');
    }

    const esimOffer = await this.esimOfferRepository.findOne({
      where: {
        id: esimOfferId,
        organizationId: organization.id,
      },
    });

    if (!esimOffer) {
      throw new NotFoundException(
        `Esim offer with ID ${esimOfferId} not found in current organization`
      );
    }

    await this.esimOfferRepository.remove(esimOffer);
    return esimOffer;
  }
}
