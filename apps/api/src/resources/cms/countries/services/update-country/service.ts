// apps/api/src/resources/countries/services/update-country/service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountryEntity } from '@/database/entities/country.entity';
import { UpdateCountryDto } from './update-country.dto';
import { ICountry } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';

//------------------------------------------------------

@Injectable()
export class UpdateCountryService {
  constructor(
    @InjectRepository(CountryEntity)
    private countryRepository: Repository<CountryEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async updateCountry(updateCountryDto: UpdateCountryDto): Promise<ICountry> {
    if (!updateCountryDto.id) {
      throw new NotFoundException('Country ID is required');
    }

    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    if (!organization) {
      throw new ForbiddenException('Organization context required');
    }

    const country = await this.countryRepository.findOne({
      where: {
        id: updateCountryDto.id,
        organizationId: organization.id,
      },
    });

    if (!country) {
      throw new NotFoundException(
        `Country with ID ${updateCountryDto.id} not found in current organization`
      );
    }

    if (updateCountryDto.flagAvatarUrl !== undefined) {
      country.flagAvatarUrl = updateCountryDto.flagAvatarUrl;
    }
    if (updateCountryDto.flagProductImageUrl !== undefined) {
      country.flagProductImageUrl = updateCountryDto.flagProductImageUrl;
    }

    return this.countryRepository.save(country);
  }
}
