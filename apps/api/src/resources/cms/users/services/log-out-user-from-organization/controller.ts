// apps/api/src/resources/cms/users/services/log-out-user-from-organization/controller.ts
import { Controller, Patch } from '@nestjs/common';
import { LogOutUserFromOrganizationService } from './service';
import { IUser } from '@connect-phone/shared-types';
import { NoCacheInvalidation } from '@/common/decorators/no-cache-invalidation.decorator';

//----------------------------------------------------------------------

@Controller()
@NoCacheInvalidation()
export class LogOutUserFromOrganizationController {
  constructor(
    private readonly logOutService: LogOutUserFromOrganizationService
  ) {}

  @Patch()
  async logOutUserFromOrganization(): Promise<IUser> {
    return this.logOutService.logOutUserFromOrganization();
  }
}
