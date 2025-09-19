// apps/api/src/resources/user-invitations/user-invitations.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInvitationEntity } from '@/database/entities/user-invitation.entity';
import { OrganizationEntity } from '@/database/entities/organization.entity';
import { UserEntity } from '@/database/entities/user.entity';

// controllers
import { FindAllByOrgPaginatedController } from './services/find-all-by-org-paginated/controller';
import { CreateNewInvitationController } from './services/create-new-invitation/controller';

// services
import { FindAllByOrgPaginatedService } from './services/find-all-by-org-paginated/service';
import { CreateNewInvitationService } from './services/create-new-invitation/service';

//-----------------------------------------

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserInvitationEntity,
      OrganizationEntity,
      UserEntity,
    ]),
  ],
  controllers: [FindAllByOrgPaginatedController, CreateNewInvitationController],
  providers: [FindAllByOrgPaginatedService, CreateNewInvitationService],
})
export class UserInvitationsModule {}
