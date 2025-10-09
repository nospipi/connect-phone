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
  //console.log("invitationsResponse", invitationsResponse)

  return (
    <div className="relative flex h-full flex-col">
      <div className="pl-5 pt-4">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Users
        </h1>
        <TabNavigationWrapper invitationsCount={meta?.totalItems ?? 0} />
      </div>
      {children}
    </div>
  )
}

export default Layout
