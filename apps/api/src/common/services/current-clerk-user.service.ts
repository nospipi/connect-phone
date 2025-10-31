// apps/api/src/common/services/current-clerk-user.service.ts
import { Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Inject } from '@nestjs/common';
import { Request } from 'express';

//-------------------------------------------------------

@Injectable({ scope: Scope.REQUEST })
export class CurrentClerkUserService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  /**
   * Gets the current user's email from Clerk
   */

  getClerkUserEmail(): string | null {
    const user = this.request.user as
      | {
          primaryEmailAddress?: {
            emailAddress?: string;
          };
        }
      | undefined;

    return user?.primaryEmailAddress?.emailAddress || null;
  }

  /**
   * Gets the full Clerk user object from the request
   */
  getClerkUser(): any {
    return this.request.user;
  }
}
