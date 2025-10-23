// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/offers/select/PriceSelector.client.tsx

"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { RiCoinsLine, RiCloseLine } from "@remixicon/react"
import { PendingOverlay } from "@/components/common/PendingOverlay"
import { IPrice } from "@connect-phone/shared-types"
import { Badge } from "@/components/common/Badge"

//------------------------------------------------------------

interface PriceSelectorProps {
  selectedPrices: IPrice[]
  currentFilters: Record<string, string>
  onRemove: (id: number) => void
}

export default function PriceSelector({
  selectedPrices = [],
  currentFilters,
  onRemove,
}: PriceSelectorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const validPrices = selectedPrices.filter((p) => p && p.id)

  const handleSelect = () => {
    const urlParams = new URLSearchParams()
    urlParams.set("previousPage", "/inventory/offers/select")
    urlParams.set("targetField", "priceIds")
    urlParams.set("multipleSelection", "true")

    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value) urlParams.set(key, value)
    })

    if (validPrices.length > 0) {
      urlParams.set("priceIds", validPrices.map((p) => p.id).join(","))
    }

    startTransition(() => {
      router.push(`/inventory/prices/select?${urlParams.toString()}`)
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
            <RiCoinsLine className="h-4 w-4 flex-shrink-0" />
            <span>
              {validPrices.length > 0
                ? `${validPrices.length} ${validPrices.length === 1 ? "price" : "prices"}`
                : "Select prices"}
            </span>
          </div>
        </button>
      </PendingOverlay>

      {validPrices.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {validPrices.map((price) => (
            <Badge
              key={price.id}
              variant="neutral"
              className="group cursor-pointer"
              onClick={() => onRemove(price.id)}
            >
              <span className="text-xs">
                #{price.id} {price.name}
              </span>
              <RiCloseLine className="ml-1 h-3 w-3 group-hover:text-red-600" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
