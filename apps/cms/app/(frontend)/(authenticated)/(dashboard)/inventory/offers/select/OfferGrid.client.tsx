// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/offers/select/OfferGrid.client.tsx

"use client"

import { useState } from "react"
import { IEsimOffer } from "@connect-phone/shared-types"
import OfferItemButton from "./OfferItemButton.client"

//------------------------------------------------------------

interface OfferGridProps {
  items: IEsimOffer[]
  selectedIds: number[]
  multipleSelection: boolean
  page: string
  search: string
  previousPage: string
  targetField: string
  formData: Record<string, string>
}

export default function OfferGrid({
  items,
  selectedIds,
  multipleSelection,
  page,
  search,
  previousPage,
  targetField,
  formData,
}: OfferGridProps) {
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
    urlParams.set("esimOfferIds", newSelectedIds.join(","))
    return `/inventory/offers/select?${urlParams.toString()}`
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((offer) => {
        const isSelected = selectedIds.includes(offer.id)

        const newSelectedIds = multipleSelection
          ? isSelected
            ? selectedIds.filter((id) => id !== offer.id)
            : [...selectedIds, offer.id]
          : isSelected
            ? []
            : [offer.id]

        return (
          <OfferItemButton
            key={offer.id}
            offer={offer}
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
