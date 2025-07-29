import { Test, TestingModule } from '@nestjs/testing';
import { SalesChannelsController } from './sales-channels.controller';
import { SalesChannelsService } from './sales-channels.service';

describe('SalesChannelsController', () => {
  let controller: SalesChannelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesChannelsController],
      providers: [SalesChannelsService],
    }).compile();

    controller = module.get<SalesChannelsController>(SalesChannelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
