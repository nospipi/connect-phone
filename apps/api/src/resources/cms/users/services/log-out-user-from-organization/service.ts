// apps/api/src/resources/users/services/log-out-user-from-organization/service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../../../database/entities/user.entity';
import { IUser } from '@connect-phone/shared-types';
import { CurrentDbUserService } from '../../../../../common/services/current-db-user.service';

//------------------------------------------------------

@Injectable()
export class LogOutUserFromOrganizationService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly currentDbUserService: CurrentDbUserService
  ) {}

  async logOutUserFromOrganization(): Promise<IUser> {
    const user = await this.currentDbUserService.getCurrentDbUser();
    if (!user) throw new NotFoundException('No current user');

    user.loggedOrganizationId = null;
    user.loggedOrganization = null;
    return this.userRepository.save(user);
  }
}
