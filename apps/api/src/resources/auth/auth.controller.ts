import { User } from '@clerk/backend';
import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Chifsa } from '@connect-phone/shared-types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  getProfile() {
    return this.authService.getProfile();
  }
}
