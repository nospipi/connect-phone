import TabNavigationWrapper from "./TabNavigationWrapper.client"
import { getAllInvitationsOfOrganizationPaginated } from "@/app/(backend)/server_actions/getAllInvitationsOfOrganizationPaginated"

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
  console.log("invitationsResponse", invitationsResponse)

  return (
    <div className="flex h-full flex-col gap-2 py-4 pl-5">
      <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
        Users
      </h1>
      <TabNavigationWrapper invitationsCount={meta?.totalItems ?? 0} />
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  )
}

export default Layout
