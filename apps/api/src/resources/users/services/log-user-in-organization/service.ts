// src/resources/users/services/log-user-in-organization/service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../../database/entities/user.entity';
import { IUser } from '@connect-phone/shared-types';
import { OrganizationEntity } from '../../../../database/entities/organization.entity';
import { CurrentDbUserService } from '@/common/services/current-db-user.service';
import { OrganizationContext } from '../../../../common/context/organization-context';

//-----------------------------------------------------------------s

@Injectable()
export class LogUserInOrganizationService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OrganizationEntity)
    private organizationRepository: Repository<OrganizationEntity>,
    private readonly currentDbUserService: CurrentDbUserService
  ) {}

  async logUserInOrganization(organizationId: number): Promise<IUser> {
    const user = await this.currentDbUserService.getCurrentDbUser();
    if (!user) throw new NotFoundException('No current user');

    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });
    if (!organization) throw new NotFoundException('Organization not found');

    const userOrganizationsIds = user.userOrganizations.map(
      (uo) => uo.organizationId
    );
    if (!userOrganizationsIds.includes(organizationId)) {
      throw new ForbiddenException('User does not belong to this organization');
    }

    user.loggedOrganizationId = organizationId;
    user.loggedOrganization = organization;

    // Save within the correct organization context
    return OrganizationContext.run(organizationId, async () => {
      return this.userRepository.save(user);
    });
  }
}
