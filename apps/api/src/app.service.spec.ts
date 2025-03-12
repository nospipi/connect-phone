import { Test, TestingModule } from '@nestjs/testing';
import { AppService, html } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should return the expected HTML', async () => {
    const result = await service.getHello();
    expect(result).toBe(html);
  });
});
