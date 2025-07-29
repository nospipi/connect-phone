import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { SalesChannelsService } from './sales-channels.service';
import { CreateSalesChannelDto } from './dto/create-sales-channel.dto';
import { UpdateSalesChannelDto } from './dto/update-sales-channel.dto';
import { RequiresOrganization } from '../guards/decorators/requires-organization.decorator';
import { CurrentUserOrganizationFromClerk } from '../guards/decorators/current-user-organization.decorator';
import { Organization, SalesChannel } from '../db.module';
import { Public } from '../guards/decorators/public.decorator';

//------------------------------------------------------------------------

@Controller('sales-channels')
export class SalesChannelsController {
  constructor(private readonly salesChannelsService: SalesChannelsService) {}

  @Public() // Temporary override guards for public access
  @Get('paginated')
  async getSalesChannelsOfOrganizationPaginated(
    @CurrentUserOrganizationFromClerk() organization: Organization | null,
    @Query('cursor') cursor?: string,
    @Query('pageSize') pageSize?: string,
    @Query('organizationId') organizationId?: string //temporary
  ): Promise<SalesChannel[]> {
    // Use organizationId parameter if provided, otherwise use organization from auth
    const finalOrganizationId = organizationId
      ? parseInt(organizationId)
      : organization?.id || 0;

    const parsedCursor = cursor ? parseInt(cursor) : undefined;
    const parsedPageSize = pageSize ? parseInt(pageSize) : 10;

    return this.salesChannelsService.getSalesChannelsOfOrganizationPaginated(
      finalOrganizationId,
      parsedCursor,
      parsedPageSize
    );
  }

  @Post()
  create(@Body() createSalesChannelDto: CreateSalesChannelDto) {
    return this.salesChannelsService.create(createSalesChannelDto);
  }

  @Get()
  findAll() {
    return this.salesChannelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesChannelsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSalesChannelDto: UpdateSalesChannelDto
  ) {
    return this.salesChannelsService.update(+id, updateSalesChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesChannelsService.remove(+id);
  }
}
