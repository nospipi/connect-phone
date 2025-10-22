// apps/api/src/common/interceptors/transaction-rls.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

//------------------------------------------------------------

@Injectable()
export class TransactionRlsInterceptor implements NestInterceptor {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const queryRunner = this.dataSource.createQueryRunner();

    return from(this.setupRlsContext(request, queryRunner)).pipe(
      switchMap(() => next.handle()),
      finalize(() => {
        if (!queryRunner.isReleased) {
          queryRunner.release().catch((error) => {
            console.error('Error releasing query runner:', error);
          });
        }
      })
    );
  }

  private async setupRlsContext(request: any, queryRunner: any): Promise<void> {
    try {
      await queryRunner.connect();

      const userId = request.currentDbUser?.id || 0;
      const organizationId =
        request.currentOrganization?.id ||
        request.currentDbUser?.loggedOrganizationId ||
        0;

      await queryRunner.query(
        `SELECT set_config('app.current_user_id', '${userId}', true)`
      );
      await queryRunner.query(
        `SELECT set_config('app.current_organization_id', '${organizationId}', true)`
      );

      console.log(
        `🔐 RLS Context: user_id=${userId}, organization_id=${organizationId}`
      );
    } catch (error) {
      console.error('❌ Error setting RLS context:', error);
      await queryRunner.release();
      throw error;
    }
  }
}
