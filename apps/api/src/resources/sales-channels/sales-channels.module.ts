// apps/api/src/resources/sales-channels/sales-channels.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesChannelEntity } from '@/database/entities/sales-channel.entity';
import { OrganizationEntity } from '@/database/entities/organization.entity';
import { UserEntity } from '@/database/entities/user.entity';

// controllers
import { FindAllByOrgPaginatedController } from './services/find-all-by-org-paginated/controller';
import { CreateNewChannelController } from './services/create-new-channel/controller';
import { UpdateSalesChannelController } from './services/update-sales-channel/controller';
import { GetSalesChannelByIdController } from './services/get-sales-channel-by-id/controller';
import { DeleteSalesChannelController } from './services/delete-sales-channel/controller';

// services
import { FindAllByOrgPaginatedService } from './services/find-all-by-org-paginated/service';
import { CreateNewChannelService } from './services/create-new-channel/service';
import { UpdateSalesChannelService } from './services/update-sales-channel/service';
import { GetSalesChannelByIdService } from './services/get-sales-channel-by-id/service';
import { DeleteSalesChannelService } from './services/delete-sales-channel/service';

//-----------------------------------------

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SalesChannelEntity,
      OrganizationEntity,
      UserEntity,
    ]),
  ],
  controllers: [
    FindAllByOrgPaginatedController,
    CreateNewChannelController,
    UpdateSalesChannelController,
    GetSalesChannelByIdController,
    DeleteSalesChannelController,
  ],
  providers: [
    FindAllByOrgPaginatedService,
    CreateNewChannelService,
    UpdateSalesChannelService,
    GetSalesChannelByIdService,
    DeleteSalesChannelService,
  ],
})
export class SalesChannelsModule {}
