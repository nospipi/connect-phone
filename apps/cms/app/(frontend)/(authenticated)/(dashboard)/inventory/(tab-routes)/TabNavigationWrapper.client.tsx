"use client"

import { RiCoupon2Line, RiBox3Fill, RiFlagLine } from "@remixicon/react"
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
      name: "Products",
      href: "/inventory/products",
      icon: RiCoupon2Line,
    },
    {
      name: "Packages",
      href: "/inventory/packages",
      icon: RiBox3Fill,
    },
    {
      name: "Countries",
      href: "/inventory/countries",
      icon: RiFlagLine,
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
