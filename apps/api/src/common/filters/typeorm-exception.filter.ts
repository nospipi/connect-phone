// apps/api/src/common/filters/typeorm-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

//------------------------------------------------------------

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    //console.error('TypeORM Query Failed Error:', exception);

    response.status(400).json({
      statusCode: 400,
      message: exception.message,
      detail: (exception as any).detail,
    });
  }
}
