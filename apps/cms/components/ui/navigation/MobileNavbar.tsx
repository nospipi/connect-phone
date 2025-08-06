// MobileNavbar.tsx (Server Component)
import { OrganizationsDropdownMobile } from "./SidebarWorkspacesDropdown"
import { UserProfileMobile } from "./UserProfile"
import MobileSidebar from "./MobileSidebar"

const MobileNavbar = async () => {
  return (
    <nav className="flex items-center justify-between gap-x-6 border-b border-gray-200 bg-white p-4 px-2 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <OrganizationsDropdownMobile />
      <div className="flex items-center gap-1 sm:gap-2">
        <UserProfileMobile />
        <MobileSidebar />
      </div>
    </nav>
  )
}

export default MobileNavbar
