// apps/api/src/resources/user-invitations/services/create-new-invitation/create-user-invitation.dto.ts
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { IUserInvitation } from '@connect-phone/shared-types';
import { Sanitize } from '@/common/decorators/sanitize.decorator';
//----------------------------------------------------------------------------

// Remove 'id', 'organizationId', 'invitedById', 'status', 'createdAt' since they're handled automatically
type CreateUserInvitation = Pick<IUserInvitation, 'email'>;

export class CreateUserInvitationDto implements CreateUserInvitation {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Sanitize()
  email: string;
}
