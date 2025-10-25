// apps/api/src/resources/countries/services/get-all-countries-of-org/service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountryEntity } from '../../../../database/entities/country.entity';
import { ICountry } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '../../../../common/services/current-organization.service';

//------------------------------------------------------

@Injectable()
export class GetAllCountriesOfOrgService {
  constructor(
    @InjectRepository(CountryEntity)
    private countryRepository: Repository<CountryEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async getAllCountries(
    search: string = '',
    region: string = 'all'
  ): Promise<ICountry[]> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    const queryBuilder = this.countryRepository
      .createQueryBuilder('country')
      .where('country.organizationId = :organizationId', {
        organizationId: organization?.id,
      });

    if (search && search.trim().length > 0) {
      const searchTerm = `%${search.trim()}%`;
      queryBuilder.andWhere('country.name ILIKE :search', {
        search: searchTerm,
      });
    }

    if (region && region.toLowerCase() !== 'all') {
      queryBuilder.andWhere('country.region = :region', {
        region: region.toLowerCase(),
      });
    }

    queryBuilder.orderBy('country.name', 'ASC');

    return queryBuilder.getMany();
  }
}
