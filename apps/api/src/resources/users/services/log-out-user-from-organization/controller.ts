// apps/api/src/resources/users/services/log-out-user-from-organization/controller.ts
import { Controller, Patch } from '@nestjs/common';
import { LogOutUserFromOrganizationService } from './service';
import { User } from '../../../../database/entities/user.entity';

@Controller('users/log-out-organization')
export class LogOutUserFromOrganizationController {
  constructor(
    private readonly logOutService: LogOutUserFromOrganizationService
  ) {}

  @Patch()
  async logOutUserFromOrganization(): Promise<User> {
    return this.logOutService.logOutUserFromOrganization();
  }
}
