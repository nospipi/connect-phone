// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/(tab-routes)/CreateButtonRenderer.client.tsx

"use client"

import { usePathname } from "next/navigation"
import { RiAddLine } from "@remixicon/react"
import { PendingOverlay } from "@/components/common/PendingOverlay"

//------------------------------------------------------------

const CreateButtonRenderer = () => {
  const pathname = usePathname()

  const routeConfig: Record<
    string,
    { label: string; href: string } | undefined
  > = {
    "/inventory/countries": undefined,
    "/inventory/packages": undefined,
    "/inventory/products": undefined,
    "/inventory/offers": {
      label: "Create Offer",
      href: "/inventory/offers/create-new",
    },
    "/inventory/prices": {
      label: "Create Price",
      href: "/inventory/prices/create-new",
    },
    "/inventory/calendar": {
      label: "Create Date Range",
      href: "/inventory/calendar/create-new",
    },
  }

  const config = routeConfig[pathname]

  if (!config) {
    return null
  }

  return (
    <PendingOverlay mode="navigation" href={config.href}>
      <button className="flex items-center gap-2 bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
        <RiAddLine />
        <span>{config.label}</span>
      </button>
    </PendingOverlay>
  )
}

export default CreateButtonRenderer
