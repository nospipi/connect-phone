"use client"

import { Button } from "@/components/common/Button"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/common/Drawer"
import { cx, focusRing } from "@/lib/utils"
import {
  RiMenuLine,
  RiCoupon2Line,
  RiLineChartLine,
  RiBox3Fill,
  RiSimCardLine,
  RiBuildingLine,
  RiGroupLine,
  RiFlagLine,
  RiNodeTree,
  RiArchive2Line,
  RiGovernmentLine,
} from "@remixicon/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { IOrganization } from "@connect-phone/shared-types"

const navigation = [
  {
    name: "Overview",
    href: "/overview",
    icon: RiLineChartLine,
  },
  {
    name: "Inventory",
    href: "/inventory/products",
    icon: RiArchive2Line,
  },
  {
    name: "E-Sims",
    href: "/e-sims/my-esims",
    icon: RiSimCardLine,
  },
  {
    name: "Sales channels",
    href: "/sales-channels",
    icon: RiNodeTree,
  },
  {
    name: "Organization",
    href: "/organization/users",
    icon: RiGovernmentLine,
  },
] as const

// const shortcuts = [
//   {
//     name: "Organization",
//     href: "/organization",
//     icon: RiBuildingLine,
//   },
//   {
//     name: "Sales channels",
//     href: "/sales-channels",
//     icon: RiNodeTree,
//   },
//   {
//     name: "Users",
//     href: "/users",
//     icon: RiGroupLine,
//   },
//   {
//     name: "Countries",
//     href: "/countries",
//     icon: RiFlagLine,
//   },
// ] as const

const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/)
  // Filter out words that are just symbols (like "-", "&", etc.)
  const realWords = words.filter((word) => /[a-zA-Z]/.test(word))

  if (realWords.length >= 2) {
    // Take first letter of first two real words
    return (realWords[0][0] + realWords[1][0]).toUpperCase()
  } else if (realWords.length === 1) {
    // Take first two letters of single word
    return realWords[0].substring(0, 2).toUpperCase()
  } else {
    // Fallback if no real words found
    return "??"
  }
}

export default function MobileSidebar({
  loggedInOrganization,
}: {
  loggedInOrganization: IOrganization | null
}) {
  const pathname = usePathname()

  const isActive = (itemHref: string) => {
    if (pathname === itemHref) return true

    // Extract the first path segment from both pathname and itemHref
    const currentFirstSegment = pathname?.split("/")[1]
    const itemFirstSegment = itemHref.split("/")[1]

    return currentFirstSegment === itemFirstSegment
  }
  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            aria-label="open sidebar"
            className="group flex items-center rounded-md p-2 text-sm font-medium hover:bg-gray-100 data-[state=open]:bg-gray-100 data-[state=open]:bg-gray-400/10 hover:dark:bg-gray-400/10"
          >
            <RiMenuLine
              className="size-6 shrink-0 sm:size-5"
              aria-hidden="true"
            />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="sm:max-w-lg">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-x-2.5">
              {loggedInOrganization?.logoUrl ? (
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded">
                  <Image
                    src={loggedInOrganization.logoUrl}
                    alt={`${loggedInOrganization.name} logo`}
                    width={32}
                    height={32}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <span
                  className="flex aspect-square size-8 items-center justify-center rounded bg-indigo-600 p-2 text-xs font-medium text-white dark:bg-indigo-500"
                  aria-hidden="true"
                >
                  {loggedInOrganization
                    ? getInitials(loggedInOrganization.name)
                    : "??"}
                </span>
              )}
              <span className="truncate">
                {loggedInOrganization?.name || "Select Organization"}
              </span>
            </DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <nav
              aria-label="core mobile navigation links"
              className="flex flex-1 flex-col space-y-10"
            >
              <ul role="list" className="space-y-1.5">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <DrawerClose asChild>
                      <Link
                        href={item.href}
                        className={cx(
                          isActive(item.href)
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-gray-600 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
                          "flex items-center gap-x-2.5 rounded-md px-2 py-1.5 text-base font-medium transition hover:bg-gray-100 sm:text-sm hover:dark:bg-gray-900",
                          focusRing,
                        )}
                      >
                        <item.icon
                          className="size-5 shrink-0"
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </DrawerClose>
                  </li>
                ))}
              </ul>
              {/* <div>
                <span className="text-sm font-medium leading-6 text-gray-500 sm:text-xs">
                  Settings
                </span>
                <ul aria-label="shortcuts" role="list" className="space-y-0.5">
                  {shortcuts.map((item) => (
                    <li key={item.name}>
                      <DrawerClose asChild>
                        <Link
                          href={item.href}
                          className={cx(
                            pathname === item.href ||
                              pathname?.includes(item.href)
                              ? "text-indigo-600 dark:text-indigo-400"
                              : "text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
                            "flex items-center gap-x-2.5 rounded-md px-2 py-1.5 font-medium transition hover:bg-gray-100 sm:text-sm hover:dark:bg-gray-900",
                            focusRing,
                          )}
                        >
                          <item.icon
                            className="size-4 shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </DrawerClose>
                    </li>
                  ))}
                </ul>
              </div> */}
            </nav>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
