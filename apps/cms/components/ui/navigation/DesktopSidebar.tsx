// DesktopSidebar.tsx (Server Component)
import { OrganizationsDropdownDesktop } from "./SidebarWorkspacesDropdown"
import { UserProfileDesktop } from "./UserProfile"
import { SidebarNavigation } from "./SidebarNavigation"

const DesktopSidebar = async () => {
  return (
    <nav className="inset-y-0 z-50 flex w-72 flex-col">
      <aside className="flex grow flex-col gap-y-6 overflow-y-auto border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <OrganizationsDropdownDesktop />
        <SidebarNavigation />
        <div className="mt-auto">
          <UserProfileDesktop />
        </div>
      </aside>
    </nav>
  )
}

export default DesktopSidebar
