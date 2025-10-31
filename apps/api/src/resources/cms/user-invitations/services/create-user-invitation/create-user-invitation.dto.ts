// apps/api/src/resources/cms/user-invitations/services/create-user-invitation/create-user-invitation.dto.ts
import { IsString, IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import {
  IUserInvitation,
  UserOrganizationRole,
} from '@connect-phone/shared-types';
import { Sanitize } from '@/common/decorators/sanitize.decorator';

//----------------------------------------------------------------------------

type CreateUserInvitation = Pick<IUserInvitation, 'email' | 'role'>;

export class CreateUserInvitationDto implements CreateUserInvitation {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Sanitize()
  email: string;

  @IsEnum(UserOrganizationRole)
  role: UserOrganizationRole;
}
