import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from '../db.module';
import _ from 'lodash';

//------------------------------------------------------------------------

interface DbQueries {
  createOrganization(
    createOrganizationDto: CreateOrganizationDto
  ): Promise<Organization>;
}

@Injectable()
export class OrganizationsService {
  constructor(@Inject('DB') private readonly db: DbQueries) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    try {
      console.log('Creating organization:', createOrganizationDto);
      const newOrganization = await this.db.createOrganization(
        createOrganizationDto
      );
      console.log('New organization:', newOrganization);
      return newOrganization;
    } catch (error: unknown) {
      let errorMessage = 'An error occurred while creating the organization';
      if (error && typeof error === 'object' && 'detail' in error) {
        errorMessage = error.detail as string;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  findAll() {
    return `This action returns all organizations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} organization`;
  }

  update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    return `This action updates a #${id} organization`;
  }

  remove(id: number) {
    return `This action removes a #${id} organization`;
  }
}
