// apps/api/src/resources/sales-channels/services/create-new-channel/controller.ts
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UseGuards,
  Get,
} from '@nestjs/common';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreateNewChannelService } from './service';
import { CreateSalesChannelDto } from './create-sales-channel.dto';
import { SalesChannel } from '../../../../database/entities/sales-channel.entity';
import { Organization } from '../../../../database/entities/organization.entity';
import { User } from '../../../../database/entities/user.entity';
import { Public } from '@/common/decorators/public.decorator';
import { RequiresOrganization } from '@/common/decorators/requires-organization.decorator';
import { OrganizationRequiredGuard } from '@/common/guards/organization-required.guard';
import {
  CurrentOrganization,
  RequiredOrganization,
  CurrentDbUser,
  RequiredDbUser,
} from '@/common/decorators/current-organization.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

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

@Controller('sales-channels')
@UseGuards(OrganizationRequiredGuard) // Apply guard to entire controller
export class CreateNewChannelController {
  constructor(
    private readonly createNewChannelService: CreateNewChannelService
  ) {}

  /**
   * Example 1: Using @RequiredOrganization() decorator
   * This will automatically inject the organization and throw error if not found
   */
  @Post('new')
  @RequiresOrganization() // Mark this route as requiring organization
  @UseInterceptors(LogRequestInterceptor)
  async createNew(
    @Body() createSalesChannelDto: CreateSalesChannelDto,
    @RequiredOrganization() organization: Organization,
    @RequiredDbUser() user: User,
    @CurrentUser() clerkUser: any
  ): Promise<SalesChannel> {
    console.log(
      'Creating new sales channel for organization:',
      organization.name
    );
    console.log('Database user:', user.email);
    console.log('Clerk user:', clerkUser.primaryEmailAddress?.emailAddress);

    // No need to pass organizationId - the service will get it from context
    const newSalesChannel =
      await this.createNewChannelService.createNewSalesChannel(
        createSalesChannelDto
      );

    console.log('New sales channel created:', newSalesChannel);
    return newSalesChannel;
  }

  /**
   * Example 2: Using @CurrentOrganization() decorator (optional)
   * This will inject the organization or null if not found
   */
  @Post('new-optional')
  @UseInterceptors(LogRequestInterceptor)
  async createNewOptional(
    @Body() createSalesChannelDto: CreateSalesChannelDto,
    @CurrentOrganization() organization: Organization | null,
    @CurrentDbUser() user: User | null
  ): Promise<SalesChannel | { error: string }> {
    if (!organization) {
      return { error: 'No organization found for current user' };
    }

    if (!user) {
      return { error: 'User not found in database' };
    }

    console.log(
      'Creating new sales channel for organization:',
      organization.name
    );
    console.log('User:', user.email);

    const newSalesChannel =
      await this.createNewChannelService.createNewSalesChannelForOrganization(
        createSalesChannelDto,
        organization.id
      );

    return newSalesChannel;
  }

  /**
   * Example 3: Get all sales channels for current organization
   */
  @Get('my-organization')
  @RequiresOrganization()
  async getAllForMyOrganization(
    @RequiredOrganization() organization: Organization
  ): Promise<SalesChannel[]> {
    console.log(
      'Getting all sales channels for organization:',
      organization.name
    );

    return this.createNewChannelService.getAllForCurrentOrganization();
  }

  /**
   * Example 4: Public route that doesn't require organization
   */
  @Public()
  @Get('public-info')
  async getPublicInfo(): Promise<{ message: string }> {
    // This route doesn't require authentication or organization
    return { message: 'This is public information about sales channels' };
  }
}
