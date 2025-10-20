// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/(tab-routes)/prices/DateRangeSelector.client.tsx
"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { RiCalendarLine, RiCloseLine } from "@remixicon/react"
import { PendingOverlay } from "@/components/common/PendingOverlay"
import { IDateRange } from "@connect-phone/shared-types"
import { Badge } from "@/components/common/Badge"

//------------------------------------------------------------

interface DateRangeSelectorProps {
  selectedDateRanges: IDateRange[]
  currentFilters: {
    search: string
    minAmount: string
    maxAmount: string
    currencies: string[]
    salesChannelIds: string
  }
  onRemove: (id: number) => void
}

export default function DateRangeSelector({
  selectedDateRanges = [],
  currentFilters,
  onRemove,
}: DateRangeSelectorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const validDateRanges = selectedDateRanges.filter((dr) => dr && dr.id)

  const handleSelect = () => {
    const urlParams = new URLSearchParams()
    urlParams.set("previousPage", "/inventory/prices")
    urlParams.set("targetField", "dateRangeIds")
    urlParams.set("multipleSelection", "true")

    if (currentFilters.search) urlParams.set("search", currentFilters.search)
    if (currentFilters.minAmount)
      urlParams.set("minAmount", currentFilters.minAmount)
    if (currentFilters.maxAmount)
      urlParams.set("maxAmount", currentFilters.maxAmount)
    if (currentFilters.currencies.length > 0)
      urlParams.set("currencies", currentFilters.currencies.join(","))
    if (currentFilters.salesChannelIds)
      urlParams.set("salesChannelIds", currentFilters.salesChannelIds)

    if (validDateRanges.length > 0) {
      urlParams.set(
        "dateRangeIds",
        validDateRanges.map((dr) => dr.id).join(","),
      )
    }

    startTransition(() => {
      router.push(`/inventory/calendar/select?${urlParams.toString()}`)
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
            <RiCalendarLine className="h-4 w-4 flex-shrink-0" />
            <span>
              {validDateRanges.length > 0
                ? `${validDateRanges.length} date ${validDateRanges.length === 1 ? "range" : "ranges"}`
                : "Select date ranges"}
            </span>
          </div>
        </button>
      </PendingOverlay>

      {validDateRanges.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {validDateRanges.map((dateRange) => (
            <Badge
              key={dateRange.id}
              variant="neutral"
              className="group cursor-pointer"
              onClick={() => onRemove(dateRange.id)}
            >
              <span className="text-xs">
                #{dateRange.id} {dateRange.name}
              </span>
              <RiCloseLine className="ml-1 h-3 w-3 group-hover:text-red-600" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
