// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/(tab-routes)/offers/SalesChannelSelector.client.tsx
"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { RiNodeTree, RiCloseLine } from "@remixicon/react"
import { PendingOverlay } from "@/components/common/PendingOverlay"
import { ISalesChannel } from "@connect-phone/shared-types"
import { Badge } from "@/components/common/Badge"

//------------------------------------------------------------

interface SalesChannelSelectorProps {
  selectedSalesChannels: ISalesChannel[]
  currentFilters: {
    search: string
    minDataInGb: string
    maxDataInGb: string
    isUnlimitedData: string
    minDurationInDays: string
    maxDurationInDays: string
    countryIds: string
    priceIds: string
  }
  onRemove: (id: number) => void
}

export default function SalesChannelSelector({
  selectedSalesChannels = [],
  currentFilters,
  onRemove,
}: SalesChannelSelectorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const validSalesChannels = selectedSalesChannels.filter((sc) => sc && sc.id)

  const handleSelect = () => {
    const urlParams = new URLSearchParams()
    urlParams.set("previousPage", "/inventory/offers")
    urlParams.set("targetField", "salesChannelIds")
    urlParams.set("multipleSelection", "true")

    if (currentFilters.search) urlParams.set("search", currentFilters.search)
    if (currentFilters.minDataInGb)
      urlParams.set("minDataInGb", currentFilters.minDataInGb)
    if (currentFilters.maxDataInGb)
      urlParams.set("maxDataInGb", currentFilters.maxDataInGb)
    if (currentFilters.isUnlimitedData)
      urlParams.set("isUnlimitedData", currentFilters.isUnlimitedData)
    if (currentFilters.minDurationInDays)
      urlParams.set("minDurationInDays", currentFilters.minDurationInDays)
    if (currentFilters.maxDurationInDays)
      urlParams.set("maxDurationInDays", currentFilters.maxDurationInDays)
    if (currentFilters.countryIds)
      urlParams.set("countryIds", currentFilters.countryIds)
    if (currentFilters.priceIds)
      urlParams.set("priceIds", currentFilters.priceIds)

    if (validSalesChannels.length > 0) {
      urlParams.set(
        "salesChannelIds",
        validSalesChannels.map((sc) => sc.id).join(","),
      )
    }

    startTransition(() => {
      router.push(`/sales-channels/select?${urlParams.toString()}`)
    })
  }

  return (
    <div className="flex min-w-[200px] flex-1 flex-col gap-2">
      <PendingOverlay
        mode="custom"
        onClick={handleSelect}
        isPending={isPending}
      >
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-50 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-800/50"
        >
          <div className="flex items-center gap-2">
            <RiNodeTree className="h-4 w-4 flex-shrink-0" />
            <span>
              {validSalesChannels.length > 0
                ? `${validSalesChannels.length} sales ${validSalesChannels.length === 1 ? "channel" : "channels"}`
                : "Select sales channels"}
            </span>
          </div>
        </button>
      </PendingOverlay>

      {validSalesChannels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {validSalesChannels.map((channel) => (
            <Badge
              key={channel.id}
              variant="neutral"
              className="group cursor-pointer"
              onClick={() => onRemove(channel.id)}
            >
              <span className="text-xs">
                #{channel.id} {channel.name}
              </span>
              <RiCloseLine className="ml-1 h-3 w-3 group-hover:text-red-600" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
