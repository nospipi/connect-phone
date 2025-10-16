// SidebarNavigation.tsx (Client Component)
"use client"

import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cx, focusRing } from "@/lib/utils"
import {
  RiGroupLine,
  RiSimCardLine,
  RiLineChartLine,
  RiNodeTree,
  RiArchive2Line,
  RiGovernmentLine,
  RiShoppingBagLine,
  RiMultiImageLine,
} from "@remixicon/react"
import Link from "next/link"

const navigation = [
  {
    name: "Overview",
    href: "/overview",
    icon: RiLineChartLine,
  },
  {
    name: "Inventory",
    href: "/inventory/countries",
    icon: RiArchive2Line,
  },
  {
    name: "E-Sims",
    href: "/e-sims/my-esims",
    icon: RiSimCardLine,
  },
  {
    name: "Orders",
    href: "/orders",
    icon: RiShoppingBagLine,
  },
  {
    name: "Sales channels",
    href: "/sales-channels",
    icon: RiNodeTree,
  },
  {
    name: "Users",
    href: "/users/users",
    icon: RiGroupLine,
  },
  {
    name: "Organization",
    href: "/organization/details",
    icon: RiGovernmentLine,
  },
  {
    name: "Media",
    href: "/media",
    icon: RiMultiImageLine,
  },
] as const

// const shortcuts = [
//   {
//     name: "Organization",
//     href: "/settings/organization",
//     icon: RiBuildingLine,
//   },
//   {
//     name: "Sales channels",
//     href: "/settings/sales-channels",
//     icon: RiNodeTree,
//   },
//   {
//     name: "Users",
//     href: "/settings/users",
//     icon: RiGroupLine,
//   },
//   {
//     name: "Countries",
//     href: "/settings/countries",
//     icon: RiFlagLine,
//   },
// ] as const

//-----------------------------------------------------------------------------

export function SidebarNavigation() {
  const pathname = usePathname()
  const [loadingHref, setLoadingHref] = useState<string | null>(null)

  const isActive = (itemHref: string) => {
    if (pathname === itemHref) return true

    // Extract the first path segment from both pathname and itemHref
    const currentFirstSegment = pathname?.split("/")[1]
    const itemFirstSegment = itemHref.split("/")[1]

    return currentFirstSegment === itemFirstSegment
  }

  const handleNavClick = (href: string) => {
    setLoadingHref(href)
  }

  // Clear loading state when pathname changes (navigation completed)
  useEffect(() => {
    setLoadingHref(null)
  }, [pathname])

  return (
    <>
      <nav
        aria-label="core navigation links"
        className="flex flex-1 flex-col space-y-10"
      >
        <ul role="list" className="space-y-0.5">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={() =>
                  !isActive(item.href) && handleNavClick(item.href)
                }
                className={cx(
                  isActive(item.href)
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
                  "relative flex items-center gap-x-2.5 overflow-hidden px-2 py-1.5 text-sm font-medium transition hover:bg-gray-100 hover:dark:bg-gray-900",
                  focusRing,
                )}
              >
                {loadingHref === item.href && (
                  <div className="absolute inset-0 animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-gray-900/20 to-transparent dark:via-white/20"></div>
                )}
                <item.icon className="size-4 shrink-0" aria-hidden="true" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
      `}</style>
    </>
  )
}
