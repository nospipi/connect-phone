// src/resources/users/services/log-user-in-organization/service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../../database/entities/user.entity';
import { Organization } from '../../../../database/entities/organization.entity';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';

@Injectable()
export class LogUserInOrganizationService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    private readonly currentDbUserService: CurrentDbUserService
  ) {}

  async logUserInOrganization(organizationId: number): Promise<User> {
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
    return this.userRepository.save(user);
  }
}
