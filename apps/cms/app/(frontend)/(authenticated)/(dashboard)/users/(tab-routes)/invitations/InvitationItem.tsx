// apps/cms/app/(frontend)/(authenticated)/(dashboard)/users/(tab-routes)/invitations/InvitationItem.tsx

import { Badge } from "@/components/common/Badge"
import { UserOrganizationRole } from "@connect-phone/shared-types"
import DeleteInvitationButton from "./DeleteInvitationButton"

//----------------------------------------------------------------------

const InvitationItem = ({
  invitation,
}: {
  invitation: {
    id: string
    email: string
    role: UserOrganizationRole
    invitedBy?: { firstName?: string; lastName?: string; email: string }
    createdAt: string
  }
}) => {
  const invitedByName = invitation.invitedBy
    ? `${invitation.invitedBy.firstName || ""} ${invitation.invitedBy.lastName || ""}`.trim() ||
      invitation.invitedBy.email
    : "Unknown"
  const createdAt = new Date(invitation.createdAt).toLocaleDateString()

  return (
    <div key={invitation.id}>
      <div className="duration-2000 group py-4 transition-all">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-slate-200">
                  {invitation.email}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                  <span>Invited by {invitedByName}</span>
                  <span>•</span>
                  <span>{createdAt}</span>
                </div>
              </div>

              {/* Role Badge */}
              <div className="ml-4 flex-shrink-0">
                <Badge
                  variant={
                    invitation.role === UserOrganizationRole.ADMIN
                      ? "warning"
                      : "default"
                  }
                >
                  {invitation.role.charAt(0).toUpperCase() +
                    invitation.role.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          <DeleteInvitationButton invitation={invitation} />
        </div>
      </div>
    </div>
  )
}

export default InvitationItem
