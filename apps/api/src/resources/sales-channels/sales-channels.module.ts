import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesChannel } from '@/database/entities/sales-channel.entity';
import { Organization } from '@/database/entities/organization.entity';

// controllers
import { CreateRandomChannelController } from './services/create-random-channel/controller';
import { FindAllByOrgPaginatedController } from './services/find-all-by-org-paginated/controller';
import { CreateNewChannelController } from './services/create-new-channel/controller';

// services
import { CreateRandomChannelService } from './services/create-random-channel/service';
import { FindAllByOrgPaginatedService } from './services/find-all-by-org-paginated/service';
import { CreateNewChannelService } from './services/create-new-channel/service';

//-----------------------------------------

@Module({
  imports: [TypeOrmModule.forFeature([SalesChannel, Organization])],
  controllers: [
    CreateRandomChannelController,
    FindAllByOrgPaginatedController,
    CreateNewChannelController,
  ],
  providers: [
    CreateRandomChannelService,
    FindAllByOrgPaginatedService,
    CreateNewChannelService,
  ],
})
export class SalesChannelsModule {}
