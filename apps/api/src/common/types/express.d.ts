// apps/api/src/common/types/express.d.ts
import { User as ClerkUser } from '@clerk/backend';
import { UserEntity } from '@/database/entities/user.entity';
import { OrganizationEntity } from '@/database/entities/organization.entity';

declare global {
  namespace Express {
    interface Request {
      user: ClerkUser;
      currentDbUser?: UserEntity; // Added by DbUserGuard
      currentUser?: UserEntity; // Added by OrganizationGuard
      currentOrganization?: OrganizationEntity; // Added by OrganizationGuard
    }
  }
}
