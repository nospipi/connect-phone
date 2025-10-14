import TabNavigationWrapper from "./TabNavigationWrapper.client"
import { getAllInvitationsOfOrganizationPaginated } from "@/app/(backend)/server_actions/user-invitations/getAllInvitationsOfOrganizationPaginated"
import { Button } from "@/components/common/Button"
import Link from "next/link"
//-------------------------------------------------------------------

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const invitationsResponse = await getAllInvitationsOfOrganizationPaginated({
    page: "1",
    search: "",
    role: "all",
  })
  const meta = invitationsResponse?.meta

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex flex-col gap-2 pl-5 pr-3 pt-4">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Users
        </h1>

        <div className="flex items-center justify-between">
          <TabNavigationWrapper invitationsCount={meta?.totalItems ?? 0} />
          <Link href="/users/invite-user">
            <Button variant="primary" className="mb-4">
              Invite User
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}

export default Layout
