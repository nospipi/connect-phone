import { Injectable } from '@nestjs/common';
import { RequestContextService } from '../../common/core/request-context.service';

@Injectable()
export class AuthService {
  constructor(private readonly requestContext: RequestContextService) {}
  async getProfile() {
    return this.requestContext.getCurrentUser();
  }
}
