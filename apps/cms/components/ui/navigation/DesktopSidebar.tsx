// DesktopSidebar.tsx (Server Component)
import { OrganizationsDropdownDesktop } from "./SidebarOrganizationsDropdowns"
import { UserProfileDesktop } from "./UserProfile"
import { SidebarNavigation } from "./SidebarNavigation"
import { getAllOrganizationsOfUser } from "@/app/(backend)/server_actions/getAllOrganizationsOfUser"
import { getUserLoggedInOrganization } from "@/app/(backend)/server_actions/getUserLoggedInOrganization"

const DesktopSidebar = async () => {
  const organizations = await getAllOrganizationsOfUser()
  const loggedInOrganization = await getUserLoggedInOrganization()

  return (
    <nav className="inset-y-0 z-50 flex w-72 flex-col">
      <aside className="flex grow flex-col gap-y-6 overflow-y-auto border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <OrganizationsDropdownDesktop
          organizations={organizations}
          loggedInOrganization={loggedInOrganization?.id || null}
        />
        <SidebarNavigation />
        <div className="mt-auto">
          <UserProfileDesktop />
        </div>
      </aside>
    </nav>
  )
}

export default DesktopSidebar
