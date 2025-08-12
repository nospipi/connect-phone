// apps/api/src/resources/sales-channels/services/create-new-channel/controller.ts
import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
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
import { Public } from '@/common/guards/decorators/public.decorator';

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
export class CreateNewChannelController {
  constructor(
    private readonly createNewChannelService: CreateNewChannelService
  ) {}

  @Public()
  @Post('new')
  @UseInterceptors(LogRequestInterceptor)
  async createNew(
    @Body() createSalesChannelDto: CreateSalesChannelDto
  ): Promise<SalesChannel> {
    console.log(
      'Creating new sales channel with validated DTO:',
      createSalesChannelDto
    );
    const newSalesChannel =
      await this.createNewChannelService.createNewSalesChannel(
        createSalesChannelDto
      );
    console.log('New sales channel created:', newSalesChannel);
    return newSalesChannel;
  }
}
