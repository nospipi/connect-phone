// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/countries/select/CountryGrid.client.tsx

"use client"

import { useState } from "react"
import { ICountry } from "@connect-phone/shared-types"
import CountryItemButton from "./CountryItemButton.client"

//------------------------------------------------------------

interface CountryGridProps {
  items: ICountry[]
  selectedIds: number[]
  multipleSelection: boolean
  page: string
  search: string
  region: string
  previousPage: string
  targetField: string
  formData: Record<string, string>
}

export default function CountryGrid({
  items,
  selectedIds,
  multipleSelection,
  page,
  search,
  region,
  previousPage,
  targetField,
  formData,
}: CountryGridProps) {
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
    if (region && region !== "all") urlParams.set("region", region)
    urlParams.set("countryIds", newSelectedIds.join(","))
    return `/inventory/countries/select?${urlParams.toString()}`
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((country) => {
        const isSelected = selectedIds.includes(country.id)

        const newSelectedIds = multipleSelection
          ? isSelected
            ? selectedIds.filter((id) => id !== country.id)
            : [...selectedIds, country.id]
          : isSelected
            ? []
            : [country.id]

        return (
          <CountryItemButton
            key={country.id}
            country={country}
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
