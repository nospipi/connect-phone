"use client"

import { RiSimCardLine, RiBuildingLine } from "@remixicon/react"
import {
  TabNavigation,
  TabNavigationLink,
} from "@/components/common/TabNavigation"
import Link from "next/link"
import { usePathname } from "next/navigation"

//-------------------------------------------------------------------

const TabNavigationWrapper = () => {
  const pathname = usePathname()

  const navigationSettings = [
    {
      name: "My E-Sims",
      href: "/e-sims/my-esims",
      icon: RiSimCardLine,
    },
    {
      name: "Marketplace",
      href: "/e-sims/marketplace",
      icon: RiBuildingLine,
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
            count={0}
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
