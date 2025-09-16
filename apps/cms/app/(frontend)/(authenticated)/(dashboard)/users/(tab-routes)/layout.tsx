"use client"

import { RiGroupLine, RiMailSendLine } from "@remixicon/react"
import {
  TabNavigation,
  TabNavigationLink,
} from "@/components/common/TabNavigation"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigationSettings = [
  {
    name: "Users",
    href: "/users/users",
    icon: RiGroupLine,
    showCount: false,
  },
  {
    name: "Invitations",
    href: "/users/invitations",
    icon: RiMailSendLine,
    showCount: true,
  },
]

//-------------------------------------------------------------------

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  return (
    <div className="flex h-full flex-col gap-4 p-4 sm:px-6 sm:pt-10 lg:px-10 lg:pt-7">
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
        Users
      </h1>
      <TabNavigation className="relative">
        {navigationSettings.map((item) => (
          <TabNavigationLink
            href={item.href}
            key={item.name}
            asChild
            active={pathname === item.href}
            count={item.showCount ? 10 : undefined}
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
