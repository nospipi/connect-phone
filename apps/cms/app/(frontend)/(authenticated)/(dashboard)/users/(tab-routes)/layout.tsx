// apps/cms/app/(frontend)/(authenticated)/(dashboard)/users/(tab-routes)/layout.tsx

import TabNavigationWrapper from "./TabNavigationWrapper.client"
import CreateButtonRenderer from "./CreateButtonRenderer.client"
import { getAllInvitationsOfOrganizationPaginated } from "@/app/(backend)/server_actions/user-invitations/getAllInvitationsOfOrganizationPaginated"

//------------------------------------------------------------

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
      <div className="flex flex-col gap-2 pl-3 pr-3 pt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Users
          </h1>
          <CreateButtonRenderer />
        </div>

        <div className="flex items-center justify-between">
          <TabNavigationWrapper invitationsCount={meta?.totalItems ?? 0} />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  )
}

export default Layout
