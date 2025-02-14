import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { format } from 'date-fns';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService; // Add this

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService); // Get the service instance
  });

  describe('root', () => {
    it('should return the correct greeting with date and names', async () => {
      const expectedNames = 'Test User';
      const expectedDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      const expectedMessage = `Hello World!<br><br>${expectedDate}<br><br>${expectedNames}`;

      // Mock the service's getHello method
      jest.spyOn(appService, 'getHello').mockResolvedValue(expectedMessage);

      const result = await appController.getHello();

      expect(result).toBe(expectedMessage);
      expect(appService.getHello).toHaveBeenCalled();
    });

    it('should handle an empty user list', async () => {
      const expectedDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      const expectedMessage = `Hello World!<br><br>${expectedDate}<br><br>`; // No names

      jest.spyOn(appService, 'getHello').mockResolvedValue(expectedMessage);

      const result = await appController.getHello();

      expect(result).toBe(expectedMessage);
      expect(appService.getHello).toHaveBeenCalled();
    });

    it('should handle errors from the service', async () => {
      const errorMessage = 'Service Error';
      jest
        .spyOn(appService, 'getHello')
        .mockRejectedValue(new Error(errorMessage));

      await expect(appController.getHello()).rejects.toThrow(errorMessage);
      expect(appService.getHello).toHaveBeenCalled();
    });
  });
});
