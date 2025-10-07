// apps/api/src/resources/countries/services/get-all-countries-of-org/service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountryEntity } from '../../../../database/entities/country.entity';
import { ICountry } from '@connect-phone/shared-types';

@Injectable()
export class GetAllCountriesOfOrgService {
  constructor(
    @InjectRepository(CountryEntity)
    private countryRepository: Repository<CountryEntity>
  ) {}

  async getAllCountries(): Promise<ICountry[]> {
    return this.countryRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }
}
