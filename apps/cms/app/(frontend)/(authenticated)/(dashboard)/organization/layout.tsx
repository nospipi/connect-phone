"use client"

import {
  TabNavigation,
  TabNavigationLink,
} from "@/components/common/TabNavigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { RiHistoryLine, RiListSettingsLine } from "@remixicon/react"

//----------------------------------------------------

const navigationSettings = [
  {
    name: "Details",
    href: "/organization/details",
    icon: RiListSettingsLine,
  },
  { name: "Audit Log", href: "/organization/audit-log", icon: RiHistoryLine },
]

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  return (
    <div className="flex h-full flex-col gap-2 py-4 pl-5">
      <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
        Organization
      </h1>
      <TabNavigation className="relative">
        {navigationSettings.map((item) => (
          <TabNavigationLink
            href={item.href}
            key={item.name}
            asChild
            active={pathname === item.href}
            //count={item.showCount ? 10 : undefined}
          >
            <Link href={item.href} className="flex items-center">
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Link>
          </TabNavigationLink>
        ))}
      </TabNavigation>
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
