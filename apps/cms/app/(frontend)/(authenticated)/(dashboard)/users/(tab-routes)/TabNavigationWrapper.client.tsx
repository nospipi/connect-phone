"use client"

import { RiGroupLine, RiMailSendLine } from "@remixicon/react"
import {
  TabNavigation,
  TabNavigationLink,
} from "@/components/common/TabNavigation"
import Link from "next/link"
import { usePathname } from "next/navigation"

//-------------------------------------------------------------------

const TabNavigationWrapper = ({
  invitationsCount,
}: Readonly<{
  invitationsCount: number
}>) => {
  const pathname = usePathname()

  const navigationSettings = [
    {
      name: "Users",
      href: "/users/users",
      icon: RiGroupLine,
      count: 0,
    },
    {
      name: "Invitations",
      href: "/users/invitations",
      icon: RiMailSendLine,
      count: invitationsCount,
    },
  ]

  return (
    <div className="mr-3 overflow-x-auto overflow-y-hidden">
      <TabNavigation className="relative">
        {navigationSettings.map((item) => (
          <TabNavigationLink
            href={item.href}
            key={item.name}
            asChild
            active={pathname === item.href}
            count={item.count}
          >
            <Link href={item.href} className="flex items-center">
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Link>
          </TabNavigationLink>
        ))}
      </TabNavigation>
    </div>
  )
}

export default TabNavigationWrapper
