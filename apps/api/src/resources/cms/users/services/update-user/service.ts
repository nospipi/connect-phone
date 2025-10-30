// apps/api/src/resources/users/services/update-user/service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@/database/entities/user.entity';
import { UserOrganizationEntity } from '@/database/entities/user-organization.entity';
import { IUser } from '@connect-phone/shared-types';
import { CurrentDbUserService } from '@/common/services/current-db-user.service';
import { CurrentOrganizationService } from '@/common/services/current-organization.service';
import { UpdateUserDto } from './update-user.dto';

//----------------------------------------------------------------------------

@Injectable()
export class UpdateUserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserOrganizationEntity)
    private userOrganizationRepository: Repository<UserOrganizationEntity>,
    private currentDbUserService: CurrentDbUserService,
    private currentOrganizationService: CurrentOrganizationService
  ) {}

  /**
   * Update user by ID (for admin/operator use)
   */
  async updateUserById(updateData: UpdateUserDto): Promise<IUser> {
    if (!updateData.id) {
      throw new NotFoundException('User ID is required');
    }

    const user = await this.userRepository.findOne({
      where: { id: updateData.id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user basic info
    if (updateData.firstName !== undefined) {
      user.firstName = updateData.firstName;
    }
    if (updateData.lastName !== undefined) {
      user.lastName = updateData.lastName;
    }
    if (updateData.email !== undefined) {
      user.email = updateData.email;
    }

    const updatedUser = await this.userRepository.save(user);

    // Update role if provided
    if (updateData.role !== undefined) {
      const organization =
        await this.currentOrganizationService.getCurrentOrganization();

      const userOrganization = await this.userOrganizationRepository.findOne({
        where: {
          userId: updateData.id,
          organizationId: organization?.id,
        },
      });

      if (userOrganization) {
        userOrganization.role = updateData.role;
        await this.userOrganizationRepository.save(userOrganization);
      }
    }

    return updatedUser;
  }
}
