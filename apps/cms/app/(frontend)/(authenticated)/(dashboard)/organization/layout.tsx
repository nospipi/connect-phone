"use client"

import {
  TabNavigation,
  TabNavigationLink,
} from "@/components/common/TabNavigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  RiGroupLine,
  RiShieldUserLine,
  RiContactsBook2Line,
  RiHistoryLine,
} from "@remixicon/react"

const navigationSettings = [
  { name: "Users", href: "/organization/users", icon: RiGroupLine },
  { name: "Roles", href: "/organization/roles", icon: RiShieldUserLine },
  {
    name: "Customers",
    href: "/organization/customers",
    icon: RiContactsBook2Line,
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
    <div className="p-4 sm:px-6 sm:pb-10 sm:pt-10 lg:px-10 lg:pt-7">
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
        Organization
      </h1>
      <TabNavigation className="relative mt-4 sm:mt-6 lg:mt-10">
        {navigationSettings.map((item) => (
          <TabNavigationLink
            href={item.href}
            key={item.name}
            asChild
            active={pathname === item.href}
          >
            <Link href={item.href} className="flex items-center">
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Link>
          </TabNavigationLink>
        ))}
      </TabNavigation>
      <div className="pt-6">{children}</div>
    </div>
  )
}
