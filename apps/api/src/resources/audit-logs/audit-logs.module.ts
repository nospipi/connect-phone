// apps/api/src/resources/sales-channels/sales-channels.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogEntry } from '@/database/entities/audit-log.entity';
import { Organization } from '@/database/entities/organization.entity';
import { User } from '@/database/entities/user.entity';

// controllers
import { FindAllByOrgPaginatedController } from './services/find-all-by-org-paginated/controller';

// services
import { FindAllByOrgPaginatedService } from './services/find-all-by-org-paginated/service';

//-----------------------------------------

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogEntry, Organization, User])],
  controllers: [FindAllByOrgPaginatedController],
  providers: [FindAllByOrgPaginatedService],
})
export class AuditLogsModule {}
