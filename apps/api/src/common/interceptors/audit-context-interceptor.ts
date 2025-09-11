// src/common/interceptors/audit-context-interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/database/entities/user.entity';
import { UserContext } from '../context/user-context';
import { OrganizationContext } from '../context/organization-context';

//-------------------------------------------------------

@Injectable()
export class AuditContextInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return new Observable((observer) => {
      this.setupContext(context, next)
        .then((result) => {
          observer.next(result);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  private async setupContext(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const clerkUser = request.user; // Set by ClerkAuthGuard

    let userId: number | null = null;
    let organizationId: number | null = null;

    if (clerkUser?.primaryEmailAddress?.emailAddress) {
      const email = clerkUser.primaryEmailAddress.emailAddress;

      try {
        // Find the database user by email
        const dbUser = await this.userRepository.findOne({
          where: { email },
        });

        if (dbUser) {
          userId = dbUser.id;
          organizationId = dbUser.loggedOrganizationId;

          console.log(
            `🔍 Audit context set for user: ${dbUser.email} (ID: ${dbUser.id}) in organization: ${organizationId || 'none'}`
          );
        } else {
          console.log(`🔍 Clerk user ${email} not found in database`);
        }
      } catch (error) {
        console.log('🔍 Error getting user for audit:', error.message);
      }
    } else {
      console.log('🔍 No Clerk user found on request');
    }

    // Run the request within both UserContext and OrganizationContext
    return UserContext.run(userId, async () => {
      return OrganizationContext.run(organizationId, async () => {
        return firstValueFrom(next.handle());
      });
    });
  }
}
