// src/common/core/core.module.ts
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestContextService } from './request-context.service';
import { OrganizationContextService } from './organization-context.service';
import { User } from '../../database/entities/user.entity';
import { Organization } from '../../database/entities/organization.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Organization])],
  providers: [RequestContextService, OrganizationContextService],
  exports: [RequestContextService, OrganizationContextService],
})
export class CoreModule {}
