// apps/api/src/resources/countries/countries.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryEntity } from '@/database/entities/country.entity';
import { GetAllCountriesOfOrgController } from './services/get-all-countries-of-org/controller';
import { GetAllCountriesOfOrgService } from './services/get-all-countries-of-org/service';
import { UpdateCountryController } from './services/update-country/controller';
import { UpdateCountryService } from './services/update-country/service';

@Module({
  imports: [TypeOrmModule.forFeature([CountryEntity])],
  controllers: [GetAllCountriesOfOrgController, UpdateCountryController],
  providers: [GetAllCountriesOfOrgService, UpdateCountryService],
})
export class CountriesModule {}
