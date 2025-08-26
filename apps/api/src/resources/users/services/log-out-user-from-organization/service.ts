// apps/api/src/resources/users/services/log-out-user-from-organization/service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../../database/entities/user.entity';
import { CurrentDbUserService } from '../../../../common/core/current-db-user.service';

@Injectable()
export class LogOutUserFromOrganizationService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly currentDbUserService: CurrentDbUserService
  ) {}

  async logOutUserFromOrganization(): Promise<User> {
    const user = await this.currentDbUserService.getCurrentDbUser();
    if (!user) throw new NotFoundException('No current user');

    user.loggedOrganizationId = null;
    user.loggedOrganization = null;
    return this.userRepository.save(user);
  }
}
