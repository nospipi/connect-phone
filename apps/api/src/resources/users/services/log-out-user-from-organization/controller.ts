// apps/api/src/resources/users/services/log-out-user-from-organization/controller.ts
import { Controller, Patch } from '@nestjs/common';
import { LogOutUserFromOrganizationService } from './service';
import { UserEntity } from '../../../../database/entities/user.entity';
import { IUser } from '@connect-phone/shared-types';

@Controller('users/log-out-organization')
export class LogOutUserFromOrganizationController {
  constructor(
    private readonly logOutService: LogOutUserFromOrganizationService
  ) {}

  @Patch()
  async logOutUserFromOrganization(): Promise<IUser> {
    return this.logOutService.logOutUserFromOrganization();
  }
}
