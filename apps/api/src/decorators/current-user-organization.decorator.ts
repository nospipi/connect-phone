import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Organization } from '../db.module';

//--------------------------------------------

//cant call db's from decorators

export const CurrentUserOrganizationFromClerk = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Organization | null => {
    const request = ctx.switchToHttp().getRequest<Request>();
    //we get from clerk user which is available in all requests, client side and server side
    //internalOrgData is set after associating a user with an organization
    const internalOrgData = request?.user?.privateMetadata?.internalOrgData;
    if (
      internalOrgData &&
      typeof internalOrgData === 'object' &&
      'id' in internalOrgData
    ) {
      return internalOrgData as Organization;
    }
    return null;
  }
);
