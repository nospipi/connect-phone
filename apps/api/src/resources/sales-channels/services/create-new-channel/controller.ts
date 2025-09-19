// apps/api/src/resources/sales-channels/services/create-new-channel/controller.ts
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
import { CreateNewChannelService } from './service';
import { CreateSalesChannelDto } from './create-sales-channel.dto';
import { SalesChannelEntity } from '../../../../database/entities/sales-channel.entity';
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
 * Sales Channels Controller
 *
 * YOU CHOOSE: This controller applies OrganizationGuard to ALL routes
 * because sales channels are organization-specific business logic
 */
@Controller('sales-channels')
@UseGuards(OrganizationGuard) // 🎯 YOU CHOOSE: Apply organization guard to entire controller
export class CreateNewChannelController {
  constructor(
    private readonly createNewChannelService: CreateNewChannelService
  ) {}

  /**
   * Create a new sales channel
   * Organization is automatically enforced by the guard you applied
   */
  @Post('new')
  @UseInterceptors(LogRequestInterceptor)
  async createNew(
    @Body() createSalesChannelDto: CreateSalesChannelDto
  ): Promise<SalesChannelEntity> {
    // Service automatically gets organization from context
    const newSalesChannel =
      await this.createNewChannelService.createNewSalesChannel(
        createSalesChannelDto
      );

    console.log('New sales channel created:', newSalesChannel);
    return newSalesChannel;
  }

  /**
   * Get all sales channels for current organization
   */
  @Get()
  async getAllForOrganization(): Promise<SalesChannelEntity[]> {
    return this.createNewChannelService.getAllForCurrentOrganization();
  }

  /**
   * Get a specific sales channel
   */
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number
  ): Promise<SalesChannelEntity> {
    return this.createNewChannelService.findOneForCurrentOrganization(id);
  }

  /**
   * Update a sales channel
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: Partial<CreateSalesChannelDto>
  ): Promise<SalesChannelEntity> {
    return this.createNewChannelService.updateForCurrentOrganization(
      id,
      updateDto
    );
  }

  /**
   * Delete a sales channel
   */
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number
  ): Promise<{ message: string }> {
    await this.createNewChannelService.removeForCurrentOrganization(id);

    return { message: `Sales channel ${id} deleted successfully` };
  }
}
