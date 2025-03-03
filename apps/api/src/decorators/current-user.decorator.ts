import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user;
  }
);

// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { Request } from 'express';
// import { User } from '@clerk/backend';

// interface RequestWithUser extends Request {
//   user: User;
// }

// export const CurrentUser = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest<RequestWithUser>();
//     return request.user;
//   }
// );
