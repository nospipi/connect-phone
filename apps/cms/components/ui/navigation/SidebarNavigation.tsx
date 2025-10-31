// components/ui/navigation/SidebarNavigation.tsx
"use client"

import { usePathname, useSearchParams } from "next/navigation"
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
  RiArrowDownSLine,
} from "@remixicon/react"
import Link from "next/link"

//------------------------------------------------------------

type NavigationItem = {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  sections?: {
    name?: string
    items: {
      name: string
      href: string
    }[]
  }[]
}

const navigation: NavigationItem[] = [
  {
    name: "Overview",
    href: "/overview",
    icon: RiLineChartLine,
  },
  {
    name: "Inventory",
    href: "/inventory/countries",
    icon: RiArchive2Line,
    sections: [
      {
        items: [
          { name: "Countries", href: "/inventory/countries" },
          { name: "Packages", href: "/inventory/packages" },
          { name: "Products", href: "/inventory/products" },
          { name: "Offers", href: "/inventory/offers" },
          { name: "Prices", href: "/inventory/prices" },
          { name: "Calendar", href: "/inventory/calendar" },
        ],
      },
    ],
  },
  {
    name: "E-Sims",
    href: "/e-sims",
    icon: RiSimCardLine,
    sections: [
      {
        name: "General",
        items: [
          { name: "My E-Sims", href: "/e-sims/my-esims" },
          { name: "Marketplace", href: "/e-sims/marketplace" },
        ],
      },
      {
        name: "Test",
        items: [
          {
            name: "Inactive Offers",
            href: "/inventory/offers?isActive=false",
          },
          { name: "Local Providers", href: "/e-sims/local-providers" },
        ],
      },
    ],
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
    sections: [
      {
        items: [
          { name: "Users", href: "/users/users" },
          { name: "Roles", href: "/users/roles" },
          { name: "Permissions", href: "/users/permissions" },
        ],
      },
    ],
  },
  {
    name: "Organization",
    href: "/organization/details",
    icon: RiGovernmentLine,
    sections: [
      {
        items: [
          { name: "Details", href: "/organization/details" },
          { name: "Audit Log", href: "/organization/audit-log" },
        ],
      },
    ],
  },
  {
    name: "Media",
    href: "/media",
    icon: RiMultiImageLine,
  },
] as const

//------------------------------------------------------------

export function SidebarNavigation() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loadingHref, setLoadingHref] = useState<string | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const isActive = (itemHref: string) => {
    const normalizedItemHref = itemHref.startsWith("/")
      ? itemHref
      : `/${itemHref}`

    const [itemPath, itemQuery] = normalizedItemHref.split("?")

    if (pathname !== itemPath) {
      return false
    }

    if (!itemQuery) {
      return searchParams.toString() === ""
    }

    const currentQuery = searchParams.toString()
    return currentQuery === itemQuery
  }

  const handleNavClick = (href: string) => {
    setLoadingHref(href)
  }

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(name)) {
        newSet.delete(name)
      } else {
        newSet.add(name)
      }
      return newSet
    })
  }

  useEffect(() => {
    navigation.forEach((item) => {
      if (item.sections) {
        const hasActiveSub = item.sections.some((section) =>
          section.items.some((subItem) => isActive(subItem.href)),
        )
        if (hasActiveSub) {
          setExpandedItems((prev) => new Set(prev).add(item.name))
        }
      }
    })
  }, [pathname, searchParams])

  useEffect(() => {
    setLoadingHref(null)
  }, [pathname, searchParams])

  return (
    <nav
      aria-label="core navigation links"
      className="flex flex-1 flex-col overflow-hidden"
    >
      <div className="flex-1 space-y-0.5 overflow-y-auto">
        <ul role="list" className="space-y-0.5">
          {navigation.map((item) => {
            const isExpanded = expandedItems.has(item.name)
            const hasActiveSub = item.sections?.some((section) =>
              section.items.some((subItem) => isActive(subItem.href)),
            )

            return (
              <li key={item.name}>
                {item.sections ? (
                  <>
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className={cx(
                        hasActiveSub
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
                        "sticky top-0 z-10 flex w-full items-center justify-between overflow-hidden bg-white px-2 py-1.5 text-sm font-medium transition hover:bg-gray-100 dark:bg-gray-950 hover:dark:bg-gray-900",
                        focusRing,
                      )}
                    >
                      <div className="flex items-center gap-x-2.5">
                        <item.icon
                          className="size-4 shrink-0"
                          aria-hidden="true"
                        />
                        {item.name}
                      </div>
                      <RiArrowDownSLine
                        className={cx(
                          "size-4 shrink-0 transition-transform",
                          isExpanded && "-scale-y-100",
                        )}
                        aria-hidden="true"
                      />
                    </button>

                    <div
                      className={cx(
                        "grid transition-all duration-200",
                        isExpanded
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="space-y-0.5 py-1">
                          {item.sections.map((section, sectionIndex) => (
                            <div key={section.name || sectionIndex}>
                              {section.name && (
                                <div className="px-2 py-1">
                                  <span className="text-xs font-medium text-gray-500">
                                    {section.name}
                                  </span>
                                </div>
                              )}
                              {section.items.map((subItem) => (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  onClick={() =>
                                    !isActive(subItem.href) &&
                                    handleNavClick(subItem.href)
                                  }
                                  className={cx(
                                    isActive(subItem.href)
                                      ? "bg-gray-100 text-indigo-600 dark:bg-gray-900 dark:text-indigo-400"
                                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-500 hover:dark:bg-gray-900/50 hover:dark:text-gray-50",
                                    "relative flex items-center justify-between overflow-hidden py-1.5 pl-9 pr-2 text-sm transition",
                                    focusRing,
                                  )}
                                >
                                  <span>{subItem.name}</span>
                                  {loadingHref === subItem.href && (
                                    <div className="flex items-center gap-1">
                                      <div className="h-1 w-1 animate-pulse rounded-full bg-gray-500 [animation-delay:-0.6s] [animation-duration:1.2s] dark:bg-gray-600"></div>
                                      <div className="h-1 w-1 animate-pulse rounded-full bg-gray-500 [animation-delay:-0.3s] [animation-duration:1.2s] dark:bg-gray-600"></div>
                                      <div className="h-1 w-1 animate-pulse rounded-full bg-gray-500 [animation-duration:1.2s] dark:bg-gray-600"></div>
                                    </div>
                                  )}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() =>
                      !isActive(item.href) && handleNavClick(item.href)
                    }
                    className={cx(
                      isActive(item.href)
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
                      "relative flex items-center justify-between overflow-hidden px-2 py-1.5 text-sm font-medium transition hover:bg-gray-100 hover:dark:bg-gray-900",
                      focusRing,
                    )}
                  >
                    <div className="flex items-center gap-x-2.5">
                      <item.icon
                        className="size-4 shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                    </div>
                    {loadingHref === item.href && (
                      <div className="flex items-center gap-1">
                        <div className="h-1 w-1 animate-pulse rounded-full bg-gray-500 [animation-delay:-0.6s] [animation-duration:1.2s] dark:bg-gray-600"></div>
                        <div className="h-1 w-1 animate-pulse rounded-full bg-gray-500 [animation-delay:-0.3s] [animation-duration:1.2s] dark:bg-gray-600"></div>
                        <div className="h-1 w-1 animate-pulse rounded-full bg-gray-500 [animation-duration:1.2s] dark:bg-gray-600"></div>
                      </div>
                    )}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
