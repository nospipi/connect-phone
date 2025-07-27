import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import {
  CreateOrganizationDto,
  AddOrganizationUrlDto,
} from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { RequiresOrganization } from '../guards/decorators/requires-organization.decorator';
import { CurrentUserOrganizationFromClerk } from 'src/guards/decorators/current-user-organization.decorator';
import { Organization } from '../db.module';

//------------------------------------------------------------------------

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsService.create(createOrganizationDto);
  }

  @Post('add_logo_url_to_organization')
  addLogoUrlToOrganization(
    @Body() addUrlDto: AddOrganizationUrlDto,
    @CurrentUserOrganizationFromClerk() organization: Organization | null
  ) {
    return this.organizationsService.addLogoUrlToOrganization(
      addUrlDto,
      organization?.id || 0
    );
  }

  @Get()
  @RequiresOrganization()
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto
  ) {
    return this.organizationsService.update(+id, updateOrganizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(+id);
  }
}
