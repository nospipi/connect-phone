// src/common/core/core.module.ts
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentOrganizationService } from './current-organization.service';
import { CurrentDbUserService } from './current-db-user.service';
import { CurrentClerkUserService } from './current-clerk-user.service';

import { User } from '../../database/entities/user.entity';
import { Organization } from '../../database/entities/organization.entity';
import { SalesChannel } from '@/database/entities/sales-channel.entity';
import { AuditLogEntry } from '@/database/entities/audit-log.entity';
import { AuditLogSubscriber } from '@/database/subscribers/audit-log.subscriber';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Organization, SalesChannel, AuditLogEntry]),
  ],
  providers: [
    CurrentClerkUserService,
    CurrentDbUserService,
    CurrentOrganizationService,
    AuditLogSubscriber,
  ],
  exports: [
    CurrentClerkUserService,
    CurrentDbUserService,
    CurrentOrganizationService,
    AuditLogSubscriber,
  ],
})
export class CoreModule {}
