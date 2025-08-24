// apps/api/src/resources/sales-channels/sales-channels.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesChannel } from '@/database/entities/sales-channel.entity';
import { Organization } from '@/database/entities/organization.entity';
import { User } from '@/database/entities/user.entity';

// controllers
import { FindAllByOrgPaginatedController } from './services/find-all-by-org-paginated/controller';
import { CreateNewChannelController } from './services/create-new-channel/controller';

// services
import { FindAllByOrgPaginatedService } from './services/find-all-by-org-paginated/service';
import { CreateNewChannelService } from './services/create-new-channel/service';

//-----------------------------------------

@Module({
  imports: [TypeOrmModule.forFeature([SalesChannel, Organization, User])],
  controllers: [FindAllByOrgPaginatedController, CreateNewChannelController],
  providers: [FindAllByOrgPaginatedService, CreateNewChannelService],
})
export class SalesChannelsModule {}
