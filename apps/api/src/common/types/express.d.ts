// src/common/types/express.d.ts
import { User as ClerkUser } from '@clerk/backend';
import { User } from '../../database/entities/user.entity';
import { Organization } from '../../database/entities/organization.entity';

declare global {
  namespace Express {
    interface Request {
      user: ClerkUser;
      currentDbUser?: User; // Added by DbUserGuard
      currentUser?: User; // Added by OrganizationGuard
      currentOrganization?: Organization; // Added by OrganizationGuard
    }
  }
}
