// src/core/request-context.service.ts
import { Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Inject } from '@nestjs/common';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  getEmail(): string | null {
    const user = this.request.user as
      | {
          primaryEmailAddress?: {
            emailAddress?: string;
          };
        }
      | undefined;

    return user?.primaryEmailAddress?.emailAddress || null;
  }

  getCurrentUser() {
    return this.request.user || null;
  }
}
