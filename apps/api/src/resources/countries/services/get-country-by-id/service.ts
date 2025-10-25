// apps/api/src/resources/countries/services/get-country-by-id/service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountryEntity } from '../../../../database/entities/country.entity';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { ICountry } from '@connect-phone/shared-types';

//------------------------------------------------------

@Injectable()
export class GetCountryByIdService {
  constructor(
    @InjectRepository(CountryEntity)
    private countryRepository: Repository<CountryEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async getCountryById(countryId: number): Promise<ICountry> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    if (!organization) {
      throw new ForbiddenException('Organization context required');
    }

    const country = await this.countryRepository.findOne({
      where: {
        id: countryId,
        organizationId: organization.id,
      },
      relations: ['organization'],
    });

    if (!country) {
      throw new NotFoundException(
        `Country with ID ${countryId} not found in current organization`
      );
    }

    return country;
  }
}
