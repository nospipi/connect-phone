// apps/api/src/resources/organizations/services/update-organization/service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationEntity } from '@/database/entities/organization.entity';
import { UpdateOrganizationDto } from './update-organization.dto';
import { IOrganization } from '@connect-phone/shared-types';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';

//----------------------------------------------------------------------

@Injectable()
export class UpdateOrganizationService {
  constructor(
    @InjectRepository(OrganizationEntity)
    private organizationRepository: Repository<OrganizationEntity>,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  async updateOrganization(
    updateOrganizationDto: UpdateOrganizationDto
  ): Promise<IOrganization> {
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    if (!organization) {
      throw new ForbiddenException('Organization context required');
    }

    if (updateOrganizationDto.name !== undefined) {
      organization.name = updateOrganizationDto.name;
    }
    if (updateOrganizationDto.logoId !== undefined) {
      organization.logoId = updateOrganizationDto.logoId;
    }
    if (updateOrganizationDto.mainCurrency !== undefined) {
      organization.mainCurrency = updateOrganizationDto.mainCurrency;
    }

    const savedOrganization =
      await this.organizationRepository.save(organization);

    const updatedOrganization = await this.organizationRepository.findOne({
      where: { id: savedOrganization.id },
      relations: ['logo'],
    });

    return updatedOrganization!;
  }
}
