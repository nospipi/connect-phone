// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/offers/select/CountrySelector.client.tsx

"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { RiGlobalLine, RiCloseLine } from "@remixicon/react"
import { PendingOverlay } from "@/components/common/PendingOverlay"
import { ICountry } from "@connect-phone/shared-types"
import { Badge } from "@/components/common/Badge"

//------------------------------------------------------------

interface CountrySelectorProps {
  selectedCountries: ICountry[]
  currentFilters: Record<string, string>
  onRemove: (id: number) => void
}

export default function CountrySelector({
  selectedCountries = [],
  currentFilters,
  onRemove,
}: CountrySelectorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const validCountries = selectedCountries.filter((c) => c && c.id)

  const handleSelect = () => {
    const urlParams = new URLSearchParams()
    urlParams.set("previousPage", "/inventory/offers/select")
    urlParams.set("targetField", "countryIds")
    urlParams.set("multipleSelection", "true")

    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value) urlParams.set(key, value)
    })

    if (validCountries.length > 0) {
      urlParams.set("countryIds", validCountries.map((c) => c.id).join(","))
    }

    startTransition(() => {
      router.push(`/inventory/countries/select?${urlParams.toString()}`)
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
            <RiGlobalLine className="h-4 w-4 flex-shrink-0" />
            <span>
              {validCountries.length > 0
                ? `${validCountries.length} ${validCountries.length === 1 ? "country" : "countries"}`
                : "Select countries"}
            </span>
          </div>
        </button>
      </PendingOverlay>

      {validCountries.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {validCountries.map((country) => (
            <Badge
              key={country.id}
              variant="neutral"
              className="group cursor-pointer"
              onClick={() => onRemove(country.id)}
            >
              <span className="text-xs">
                #{country.id} {country.name}
              </span>
              <RiCloseLine className="ml-1 h-3 w-3 group-hover:text-red-600" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
