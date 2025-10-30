// apps/cms/app/(frontend)/(authenticated)/(dashboard)/users/(tab-routes)/users/UserItem.tsx

import Link from "next/link"
import { Badge } from "@/components/common/Badge"
import { UserOrganizationRole } from "@connect-phone/shared-types"

//------------------------------------------------------------

interface UserItemProps {
  userOrganization: {
    user: {
      id: number
      email: string
      firstName: string
      lastName: string
    }
    role: UserOrganizationRole
  }
}

const getInitials = (firstName: string, lastName: string): string => {
  const first = firstName?.trim() || ""
  const last = lastName?.trim() || ""

  if (first && last) {
    return (first[0] + last[0]).toUpperCase()
  } else if (first) {
    return first.substring(0, 2).toUpperCase()
  } else if (last) {
    return last.substring(0, 2).toUpperCase()
  }
  return "??"
}

export const UserItem = ({ userOrganization }: UserItemProps) => {
  const user = userOrganization.user
  const role = userOrganization.role
  const initials = getInitials(user.firstName, user.lastName)
  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email

  return (
    <Link href={`/users/${user.id}`} className="block">
      <div className="group py-4">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gray-200 to-gray-300 text-sm font-semibold text-gray-700 shadow-sm dark:from-slate-700/60 dark:to-slate-800/60 dark:text-slate-200">
              {initials}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 group-hover:underline dark:text-slate-200">
                  {fullName}
                </p>
                <p className="truncate text-sm text-gray-600 dark:text-slate-400">
                  {user.email}
                </p>
              </div>

              <div className="ml-4 flex-shrink-0">
                <Badge
                  variant={
                    role === UserOrganizationRole.ADMIN ? "warning" : "default"
                  }
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
