// MobileNavbar.tsx (Server Component)
import { OrganizationsDropdownMobile } from "./SidebarOrganizationsDropdowns"
import { UserProfileMobile } from "./UserProfile"
import MobileSidebar from "./MobileSidebar"
import { getAllOrganizationsOfUser } from "@/app/(backend)/server_actions/users/getAllOrganizationsOfUser"
import { getUserLoggedInOrganization } from "@/app/(backend)/server_actions/users/getUserLoggedInOrganization"

//----------------------------------------------------------------------------

const MobileNavbar = async () => {
  const organizations = await getAllOrganizationsOfUser()
  const loggedInOrganization = await getUserLoggedInOrganization()

  return (
    <nav className="flex items-center justify-between gap-x-6 border-b border-gray-200 bg-white p-4 px-2 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <OrganizationsDropdownMobile
        organizations={organizations}
        loggedInOrganization={loggedInOrganization?.id || null}
      />
      <div className="flex items-center gap-1 sm:gap-2">
        <UserProfileMobile />
        <MobileSidebar loggedInOrganization={loggedInOrganization} />
      </div>
    </nav>
  )
}

export default MobileNavbar
