import { headers } from "next/headers"
import { siteConfig } from "@/app/siteConfig"
import { cx, focusRing } from "@/lib/utils"
//import OrganizationsSelector from "./OrganizationsSelector"
import {

  RiGroupLine,
  RiFlagLine,
  RiCoupon2Line,

  RiSimCardLine,
  RiLineChartLine,
  RiBuildingLine,
} from "@remixicon/react"
import Link from "next/link"
//import { usePathname } from "next/navigation"
import MobileSidebar from "./MobileSidebar"
import {
  OrganizationsDropdownDesktop,
  OrganizationsDropdownMobile,
} from "./SidebarWorkspacesDropdown"
import { UserProfileDesktop, UserProfileMobile } from "./UserProfile"

const navigation = [
  {
    name: "Overview",
    href: siteConfig.baseLinks.overview,
    icon: RiLineChartLine,
  },
  { name: "Offers", href: siteConfig.baseLinks.overview, icon: RiCoupon2Line },
  { name: "E-Sims", href: siteConfig.baseLinks.details, icon: RiSimCardLine },
  // {
  //   name: "Settings",
  //   href: siteConfig.baseLinks.settings.general,
  //   icon: RiSettings5Line,
  // },
] as const

const shortcuts = [
  {
    name: "Organization",
    href: "/org_id/organization",
    icon: RiBuildingLine,
  },
  {
    name: "Users",
    href: "/settings/users",
    icon: RiGroupLine,
  },
  {
    name: "Countries",
    href: "/settings/countries",
    icon: RiFlagLine,
  },
] as const

export async function Sidebar() {
  const headerList = await headers()
  const pathname = headerList.get("x-current-path")

  const isActive = (itemHref: string) => {
    if (itemHref === siteConfig.baseLinks.settings.general) {
      return pathname?.startsWith("/settings")
    }
    return pathname === itemHref || pathname?.startsWith(itemHref)
  }

  return (
    <>
      {/* sidebar (lg+) */}
      <nav className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <aside className="flex grow flex-col gap-y-6 overflow-y-auto border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          {/* <OrganizationsSelector /> */}
          <OrganizationsDropdownDesktop />
          <nav
            aria-label="core navigation links"
            className="flex flex-1 flex-col space-y-10"
          >
            <ul role="list" className="space-y-0.5">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cx(
                      isActive(item.href)
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
                      "flex items-center gap-x-2.5 rounded-md px-2 py-1.5 text-sm font-medium transition hover:bg-gray-100 hover:dark:bg-gray-900",
                      focusRing,
                    )}
                  >
                    <item.icon className="size-4 shrink-0" aria-hidden="true" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div>
              <span className="text-xs font-medium leading-6 text-gray-500">
                Settings
              </span>
              <ul aria-label="shortcuts" role="list" className="space-y-0.5">
                {shortcuts.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cx(
                        pathname === item.href ||
                          pathname?.startsWith(item.href)
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
                        "flex items-center gap-x-2.5 rounded-md px-2 py-1.5 text-sm font-medium transition hover:bg-gray-100 hover:dark:bg-gray-900",
                        focusRing,
                      )}
                    >
                      <item.icon
                        className="size-4 shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
          <div className="mt-auto">
            <UserProfileDesktop />
          </div>
        </aside>
      </nav>
      {/* top navbar (xs-lg) */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-2 shadow-sm sm:gap-x-6 sm:px-4 lg:hidden dark:border-gray-800 dark:bg-gray-950">
        <OrganizationsDropdownMobile />
        <div className="flex items-center gap-1 sm:gap-2">
          <UserProfileMobile />
          <MobileSidebar />
        </div>
      </div>
    </>
  )
}
