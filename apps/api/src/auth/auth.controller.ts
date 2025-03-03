import { User } from '@clerk/backend';
import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  @Get('me')
  async getProfile(@CurrentUser() user: User) {
    console.log('GET /auth/me endpoint called by user:', user.id);
    return user;
  }
}
