// src/common/core/core.module.ts
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestContextService } from './request-context.service';
import { CurrentOrganizationService } from './current-organization.service';
import { User } from '../../database/entities/user.entity';
import { Organization } from '../../database/entities/organization.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Organization])],
  providers: [RequestContextService, CurrentOrganizationService],
  exports: [RequestContextService, CurrentOrganizationService],
})
export class CoreModule {}
