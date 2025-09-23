// apps/api/src/resources/users/services/create-user-invitation/service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInvitationEntity } from '../../../../database/entities/user-invitation.entity';
import { CreateUserInvitationDto } from './create-user-invitation.dto';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';
import { IUserInvitation } from '@connect-phone/shared-types';

//-------------------------------------------

@Injectable()
export class CreateUserInvitationService {
  constructor(
    @InjectRepository(UserInvitationEntity)
    private userInvitationRepository: Repository<UserInvitationEntity>,
    private currentOrganizationService: CurrentOrganizationService,
    private currentDbUserService: CurrentDbUserService
  ) {}

  /**
   * Creates a new user invitation for the current user's organization
   * Organization is automatically retrieved from the current context
   */
  async createUserInvitation(
    createUserInvitationDto: CreateUserInvitationDto
  ): Promise<IUserInvitation> {
    console.log('createUserInvitation DTO:', createUserInvitationDto);

    const organization =
      await this.currentOrganizationService.getCurrentOrganization();
    const currentUser = await this.currentDbUserService.getCurrentDbUser();

    const userInvitation = this.userInvitationRepository.create({
      ...createUserInvitationDto,
      organizationId: organization?.id,
      invitedById: currentUser!.id,
    });

    const savedInvitation =
      await this.userInvitationRepository.save(userInvitation);

    console.log('User invitation created:', savedInvitation);
    return savedInvitation;
  }
}
