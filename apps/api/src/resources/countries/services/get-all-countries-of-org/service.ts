// apps/api/src/resources/countries/services/get-all-countries-of-org/service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountryEntity } from '../../../../database/entities/country.entity';
import { ICountry } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';

@Injectable()
export class GetAllCountriesOfOrgService {
  constructor(
    @InjectRepository(CountryEntity)
    private countryRepository: Repository<CountryEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async getAllCountries(): Promise<ICountry[]> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    return this.countryRepository.find({
      where: {
        organizationId: organization?.id,
      },
      order: {
        name: 'ASC',
      },
    });
  }
}
