// apps/api/src/resources/sales-channels/sales-channels.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesChannel } from '@/database/entities/sales-channel.entity';
import { Organization } from '@/database/entities/organization.entity';
import { User } from '@/database/entities/user.entity';

// controllers
import { CreateRandomChannelController } from './services/create-random-channel/controller';
import { FindAllByOrgPaginatedController } from './services/find-all-by-org-paginated/controller';
import { CreateNewChannelController } from './services/create-new-channel/controller';

// services
import { CreateRandomChannelService } from './services/create-random-channel/service';
import { FindAllByOrgPaginatedService } from './services/find-all-by-org-paginated/service';
import { CreateNewChannelService } from './services/create-new-channel/service';

// guards
import { OrganizationRequiredGuard } from '@/common/guards/organization-required.guard';

//-----------------------------------------

@Module({
  imports: [TypeOrmModule.forFeature([SalesChannel, Organization, User])],
  controllers: [
    CreateRandomChannelController,
    FindAllByOrgPaginatedController,
    CreateNewChannelController,
  ],
  providers: [
    CreateRandomChannelService,
    FindAllByOrgPaginatedService,
    CreateNewChannelService,
    OrganizationRequiredGuard, // Provide the guard at module level
  ],
})
export class SalesChannelsModule {}
