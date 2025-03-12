import { Injectable } from '@nestjs/common';
import { User } from '@clerk/backend';
import { RequestContextService } from '../core/request-context.service';

@Injectable()
export class AuthService {
  constructor(private readonly requestContext: RequestContextService) {}
  async getProfile() {
    return this.requestContext.getCurrentUser();
  }
}
