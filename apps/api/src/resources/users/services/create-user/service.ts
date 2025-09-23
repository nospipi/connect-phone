// apps/api/src/resources/users/services/create-user/service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UserEntity } from '../../../../database/entities/user.entity';
import { UserOrganizationEntity } from '../../../../database/entities/user-organization.entity';
import { CreateUserDto } from './create-user.dto';
import { CurrentOrganizationService } from '../../../../common/core/current-organization.service';
import { IUser, UserOrganizationRole } from '@connect-phone/shared-types';

//-------------------------------------------

@Injectable()
export class CreateUserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserOrganizationEntity)
    private userOrganizationRepository: Repository<UserOrganizationEntity>,
    private currentOrganizationService: CurrentOrganizationService,
    private dataSource: DataSource
  ) {}

  /**
   * Creates a new user and associates them with the current organization
   * Organization is automatically retrieved from the current context
   */
  async createNewUser(createUserDto: CreateUserDto): Promise<IUser> {
    console.log('createNewUser DTO:', createUserDto);

    // Automatically get the current organization from context
    const organization =
      await this.currentOrganizationService.getCurrentOrganization();

    // Use transaction to ensure both user and user-organization relationship are created
    return this.dataSource.transaction(async (manager) => {
      // Create and save the user (logged into the current organization)
      const user = manager.create(UserEntity, {
        email: createUserDto.email,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        loggedOrganizationId: organization?.id,
      });

      const savedUser = await manager.save(UserEntity, user);
      console.log('User created:', savedUser);

      // Create the user-organization relationship
      const userOrganization = manager.create(UserOrganizationEntity, {
        userId: savedUser.id,
        organizationId: organization?.id,
        role: createUserDto.role || UserOrganizationRole.OPERATOR,
      });

      await manager.save(UserOrganizationEntity, userOrganization);
      console.log('User-Organization relationship created:', userOrganization);

      // Return user with all relevant relations
      const userWithRelations = await manager.findOne(UserEntity, {
        where: { id: savedUser.id },
        relations: [
          'loggedOrganization',
          'userOrganizations',
          'userOrganizations.organization',
        ],
      });

      console.log('New user created with relations:', userWithRelations);
      return userWithRelations!;
    });
  }
}
