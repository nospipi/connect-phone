// apps/api/src/resources/users/services/log-user-in-organization/controller.ts
import { Controller, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { LogUserInOrganizationService } from './service';
import { UserEntity } from '../../../../database/entities/user.entity';
import { IUser } from '@connect-phone/shared-types';

@Controller('users/log-in-organization')
export class LogUserInOrganizationController {
  constructor(private readonly logService: LogUserInOrganizationService) {}

  @Patch(':organizationId')
  async logUserInOrganization(
    @Param('organizationId', ParseIntPipe) organizationId: number
  ): Promise<IUser> {
    return this.logService.logUserInOrganization(organizationId);
  }
}
