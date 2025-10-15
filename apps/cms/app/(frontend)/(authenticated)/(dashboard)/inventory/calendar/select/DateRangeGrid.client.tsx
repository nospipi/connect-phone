// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/calendar/select/DateRangeGrid.client.tsx
"use client"

import { useState } from "react"
import { IDateRange } from "@connect-phone/shared-types"
import DateRangeItemButton from "./DateRangeItemButton.client"

//------------------------------------------------------------

interface DateRangeGridProps {
  items: IDateRange[]
  selectedIds: number[]
  multipleSelection: boolean
  page: string
  search: string
  previousPage: string
  targetField: string
  formData: Record<string, string>
}

export default function DateRangeGrid({
  items,
  selectedIds,
  multipleSelection,
  page,
  search,
  previousPage,
  targetField,
  formData,
}: DateRangeGridProps) {
  const [isAnyLoading, setIsAnyLoading] = useState(false)

  const buildUrl = (newSelectedIds: number[]) => {
    const urlParams = new URLSearchParams()
    urlParams.set("previousPage", previousPage)
    urlParams.set("targetField", targetField)
    urlParams.set("multipleSelection", String(multipleSelection))
    Object.entries(formData).forEach(([key, value]) => {
      urlParams.set(key, value)
    })
    urlParams.set("page", page)
    if (search) urlParams.set("search", search)
    urlParams.set("selected", newSelectedIds.join(","))
    return `/inventory/calendar/select?${urlParams.toString()}`
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((dateRange) => {
        const isSelected = selectedIds.includes(dateRange.id)

        const newSelectedIds = multipleSelection
          ? isSelected
            ? selectedIds.filter((id) => id !== dateRange.id)
            : [...selectedIds, dateRange.id]
          : isSelected
            ? []
            : [dateRange.id]

        return (
          <DateRangeItemButton
            key={dateRange.id}
            dateRange={dateRange}
            isSelected={isSelected}
            newUrl={buildUrl(newSelectedIds)}
            isAnyLoading={isAnyLoading}
            onLoadingChange={setIsAnyLoading}
          />
        )
      })}
    </div>
  )
}
