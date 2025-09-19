// apps/api/src/resources/sales-channels/sales-channels.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogEntryEntity } from '@/database/entities/audit-log.entity';
import { OrganizationEntity } from '@/database/entities/organization.entity';
import { UserEntity } from '@/database/entities/user.entity';

// controllers
import { FindAllByOrgPaginatedController } from './services/find-all-by-org-paginated/controller';

// services
import { FindAllByOrgPaginatedService } from './services/find-all-by-org-paginated/service';

//-----------------------------------------

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuditLogEntryEntity,
      OrganizationEntity,
      UserEntity,
    ]),
  ],
  controllers: [FindAllByOrgPaginatedController],
  providers: [FindAllByOrgPaginatedService],
})
export class AuditLogsModule {}
