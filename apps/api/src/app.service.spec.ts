// app.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { format } from 'date-fns';
import { getUsers } from 'database';
import { User } from 'database';
import { html } from './app.service';

jest.mock('database', () => ({
  getUsers: jest.fn(),
}));

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should return base html', async () => {
    const result = await service.getHello();
    expect(result).toEqual(html);
  });

  // it('should return the correct greeting with date and names', async () => {
  //   const mockUsers: User[] = [
  //     {
  //       id: 1,
  //       createdAt: new Date(),
  //       email: 'alice@example.com',
  //       name: 'Alice',
  //     },
  //     { id: 2, createdAt: new Date(), email: 'bob@example.com', name: 'Bob' },
  //   ];
  //   (getUsers as jest.Mock).mockResolvedValue(mockUsers);

  //   const expectedNames = 'Alice<br>Bob';
  //   const expectedDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

  //   const result = await service.getHello();

  //   expect(result).toContain('Hello World!');
  //   expect(result).toContain(expectedDate);
  //   expect(result).toContain(expectedNames);
  //   expect(getUsers).toHaveBeenCalled();
  // });

  // it('should handle users with no name', async () => {
  //   const mockUsers: User[] = [
  //     {
  //       id: 1,
  //       createdAt: new Date(),
  //       email: 'alice@example.com',
  //       name: 'Alice',
  //     },
  //     { id: 2, createdAt: new Date(), email: 'bob@example.com', name: null },
  //   ];
  //   (getUsers as jest.Mock).mockResolvedValue(mockUsers);

  //   const expectedNames = 'Alice';
  //   const expectedDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

  //   const result = await service.getHello();

  //   expect(result).toContain('Hello World!');
  //   expect(result).toContain(expectedDate);
  //   expect(result).toContain(expectedNames);
  //   expect(result).not.toContain('null');
  // });

  // it('should handle empty user list', async () => {
  //   (getUsers as jest.Mock).mockResolvedValue([]);
  //   const expectedDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  //   const expectedMessage = `Hello World!<br><br>${expectedDate}`;

  //   const result = await service.getHello();

  //   expect(result).toEqual(expectedMessage);
  //   expect(getUsers).toHaveBeenCalled();
  // });

  // it('should handle errors from getUsers', async () => {
  //   const errorMessage = 'Database Error';
  //   (getUsers as jest.Mock).mockRejectedValue(new Error(errorMessage));

  //   await expect(service.getHello()).rejects.toThrow(errorMessage);
  // });
});
