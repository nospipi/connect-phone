// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/prices/select/PriceGrid.client.tsx
"use client"

import { useState } from "react"
import { IPrice } from "@connect-phone/shared-types"
import PriceItemButton from "./PriceItemButton.client"

//------------------------------------------------------------

interface PriceGridProps {
  items: IPrice[]
  selectedIds: number[]
  multipleSelection: boolean
  page: string
  search: string
  previousPage: string
  targetField: string
  formData: Record<string, string>
}

export default function PriceGrid({
  items,
  selectedIds,
  multipleSelection,
  page,
  search,
  previousPage,
  targetField,
  formData,
}: PriceGridProps) {
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
    urlParams.set("priceIds", newSelectedIds.join(","))
    return `/inventory/prices/select?${urlParams.toString()}`
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((price) => {
        const isSelected = selectedIds.includes(price.id)

        const newSelectedIds = multipleSelection
          ? isSelected
            ? selectedIds.filter((id) => id !== price.id)
            : [...selectedIds, price.id]
          : isSelected
            ? []
            : [price.id]

        return (
          <PriceItemButton
            key={price.id}
            price={price}
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
