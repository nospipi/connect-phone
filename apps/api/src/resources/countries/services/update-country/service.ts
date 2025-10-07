// apps/api/src/resources/countries/services/update-country/service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountryEntity } from '../../../../database/entities/country.entity';
import { UpdateCountryDto } from './update-country.dto';
import { ICountry } from '@connect-phone/shared-types';

@Injectable()
export class UpdateCountryService {
  constructor(
    @InjectRepository(CountryEntity)
    private countryRepository: Repository<CountryEntity>
  ) {}

  async updateCountry(updateCountryDto: UpdateCountryDto): Promise<ICountry> {
    if (!updateCountryDto.id) {
      throw new NotFoundException('Country ID is required');
    }

    const country = await this.countryRepository.findOne({
      where: { id: updateCountryDto.id },
    });

    if (!country) {
      throw new NotFoundException(
        `Country with ID ${updateCountryDto.id} not found`
      );
    }

    if (updateCountryDto.name !== undefined) {
      country.name = updateCountryDto.name;
    }
    if (updateCountryDto.flagAvatarUrl !== undefined) {
      country.flagAvatarUrl = updateCountryDto.flagAvatarUrl;
    }
    if (updateCountryDto.flagProductImageUrl !== undefined) {
      country.flagProductImageUrl = updateCountryDto.flagProductImageUrl;
    }
    if (updateCountryDto.region !== undefined) {
      country.region = updateCountryDto.region;
    }

    return this.countryRepository.save(country);
  }
}
