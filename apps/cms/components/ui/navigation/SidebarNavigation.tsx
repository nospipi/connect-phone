// SidebarNavigation.tsx (Client Component)
"use client"

import { usePathname } from "next/navigation"
import { siteConfig } from "@/components/siteConfig"
import { cx, focusRing } from "@/lib/utils"
import {
  RiGroupLine,
  RiFlagLine,
  RiCoupon2Line,
  RiBox3Fill,
  RiSimCardLine,
  RiLineChartLine,
  RiBuildingLine,
  RiNodeTree,
  RiArchive2Fill,
  RiArchiveDrawerFill,
  RiArchive2Line,
} from "@remixicon/react"
import Link from "next/link"

const navigation = [
  {
    name: "Overview",
    href: siteConfig.baseLinks.overview,
    icon: RiLineChartLine,
  },
  {
    name: "Inventory",
    href: siteConfig.baseLinks.inventory.products,
    icon: RiArchive2Line,
  },
  {
    name: "E-Sims",
    href: siteConfig.baseLinks.e_sims.my_e_sims,
    icon: RiSimCardLine,
  },
] as const

const shortcuts = [
  {
    name: "Organization",
    href: "/settings/organization",
    icon: RiBuildingLine,
  },
  {
    name: "Sales channels",
    href: "/settings/sales-channels",
    icon: RiNodeTree,
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

export function SidebarNavigation() {
  const pathname = usePathname()

  const isActive = (itemHref: string) => {
    if (pathname === itemHref) return true

    // Extract the first path segment from both pathname and itemHref
    const currentFirstSegment = pathname?.split("/")[1]
    const itemFirstSegment = itemHref.split("/")[1]

    return currentFirstSegment === itemFirstSegment
  }
  return (
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
                  pathname === item.href || pathname?.startsWith(item.href)
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
      </div>
    </nav>
  )
}
