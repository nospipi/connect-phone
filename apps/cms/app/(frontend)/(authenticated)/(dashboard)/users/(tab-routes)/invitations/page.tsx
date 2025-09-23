// apps/cms/app/(frontend)/(authenticated)/(dashboard)/users/(tab-routes)/users/page.tsx
import { Button } from "@/components/common/Button"
import { getAllInvitationsOfOrganizationPaginated } from "@/app/(backend)/server_actions/getAllInvitationsOfOrganizationPaginated"
import Link from "next/link"
import { Badge } from "@/components/common/Badge"
import { RiUser2Fill, RiSearchLine } from "@remixicon/react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/Select"
import { UserOrganizationRole } from "@connect-phone/shared-types"

//------------------------------------------------------------

const USER_ROLES = [
  { value: "all", label: "All Roles" },
  ...Object.values(UserOrganizationRole).map((role) => ({
    value: role,
    label: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
  })),
] as const

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

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const { page = "1", search = "", role = "all" } = await searchParams

  const invitationsResponse = await getAllInvitationsOfOrganizationPaginated({
    page: page,
    search: search,
    role: role,
  })

  //console.log("Invitations Response:", invitationsResponse.items)

  // Invitations Response: [
  //{
  //     id: 54,
  //     email: 'Ressie23@invitation.com',
  //     role: 'ADMIN',
  //     status: 'REJECTED',
  //     createdAt: '2025-09-23T09:53:47.387Z',
  //     organizationId: 23,
  //     invitedById: 1753,
  //     organization: {
  //       id: 23,
  //       createdAt: '2025-09-23T09:52:43.546Z',
  //       name: 'Witting - Kozey',
  //       slug: 'witting---kozey',
  //       logoUrl: null
  //     },
  //     invitedBy: {
  //       id: 1753,
  //       createdAt: '2025-09-23T09:52:44.018Z',
  //       email: 'Ewell.Rohan2@example.com',
  //       firstName: 'Ewell',
  //       lastName: 'Rohan',
  //       loggedOrganizationId: 21
  //     }
  //   }
  //]

  const items = invitationsResponse?.items || []
  const meta = invitationsResponse?.meta
  const hasPreviousPage = meta?.currentPage > 1
  const hasNextPage = meta?.currentPage < meta?.totalPages
  const hasActiveFilters = search !== "" || role !== "all"

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <Link href="/users/invite-user">
        <Button variant="primary" className="mb-4">
          Invite User
        </Button>
      </Link>
      {items.map((item, index) => {
        return (
          <div key={item.id}>
            {item.email} - {item.role} - Invited by: {item.invitedBy?.firstName}{" "}
            {item.invitedBy?.lastName}
          </div>
        )
      })}
    </div>
  )
}

export default Page
