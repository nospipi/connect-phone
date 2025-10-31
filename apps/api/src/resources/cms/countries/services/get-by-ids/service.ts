// apps/api/src/resources/cms/countries/services/get-by-ids/service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CountryEntity } from '@/database/entities/country.entity';
import { ICountry } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';

//------------------------------------------------------------

@Injectable()
export class GetCountriesByIdsService {
  constructor(
    @InjectRepository(CountryEntity)
    private countryRepository: Repository<CountryEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async getCountriesByIds(ids: number[]): Promise<ICountry[]> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    return this.countryRepository.find({
      where: {
        id: In(ids),
        organizationId: organization?.id,
      },
      order: {
        name: 'ASC',
      },
    });
  }
}
