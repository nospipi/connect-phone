// apps/api/src/resources/user-invitations/services/create-new-invitation/controller.ts
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Delete,
} from '@nestjs/common';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreateNewInvitationService } from './service';
import { CreateUserInvitationDto } from './create-user-invitation.dto';
import { UserInvitation } from '../../../../database/entities/user-invitation.entity';
import { OrganizationGuard } from '../../../../common/guards/organization.guard';

//-------------------------------------------

// Interceptor to log request body before validation
@Injectable()
export class LogRequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    console.log('Raw request body received:', request.body);
    return next.handle();
  }
}

/**
 * User Invitations Controller
 *
 * YOU CHOOSE: This controller applies OrganizationGuard to ALL routes
 * because user invitations are organization-specific business logic
 */
@Controller('user-invitations')
@UseGuards(OrganizationGuard) // 🎯 YOU CHOOSE: Apply organization guard to entire controller
export class CreateNewInvitationController {
  constructor(
    private readonly createNewInvitationService: CreateNewInvitationService
  ) {}

  /**
   * Create a new user invitation
   * Organization is automatically enforced by the guard you applied
   */
  @Post('new')
  @UseInterceptors(LogRequestInterceptor)
  async createNew(
    @Body() createUserInvitationDto: CreateUserInvitationDto
  ): Promise<UserInvitation> {
    // Service automatically gets organization from context
    const newUserInvitation =
      await this.createNewInvitationService.createNewUserInvitation(
        createUserInvitationDto
      );

    console.log('New user invitation created:', newUserInvitation);
    return newUserInvitation;
  }

  /**
   * Get all user invitations for current organization
   */
  @Get()
  async getAllForOrganization(): Promise<UserInvitation[]> {
    return this.createNewInvitationService.getAllForCurrentOrganization();
  }

  /**
   * Get a specific user invitation
   */
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number
  ): Promise<UserInvitation> {
    return this.createNewInvitationService.findOneForCurrentOrganization(id);
  }

  /**
   * Update a user invitation
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: Partial<CreateUserInvitationDto>
  ): Promise<UserInvitation> {
    return this.createNewInvitationService.updateForCurrentOrganization(
      id,
      updateDto
    );
  }

  /**
   * Delete a user invitation
   */
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number
  ): Promise<{ message: string }> {
    await this.createNewInvitationService.removeForCurrentOrganization(id);

    return { message: `User invitation ${id} deleted successfully` };
  }
}
