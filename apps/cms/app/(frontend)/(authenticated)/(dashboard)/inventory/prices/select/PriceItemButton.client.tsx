// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/prices/select/PriceItemButton.client.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RiCheckLine, RiLoader4Line } from "@remixicon/react"
import { IPrice, CURRENCIES } from "@connect-phone/shared-types"
import { Badge } from "@/components/common/Badge"

//------------------------------------------------------------

interface PriceItemButtonProps {
  price: IPrice
  isSelected: boolean
  newUrl: string
  isAnyLoading: boolean
  onLoadingChange: (loading: boolean) => void
}

export default function PriceItemButton({
  price,
  isSelected,
  newUrl,
  isAnyLoading,
  onLoadingChange,
}: PriceItemButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(false)
    onLoadingChange(false)
  }, [isSelected, onLoadingChange])

  const handleClick = () => {
    if (isAnyLoading) return
    setIsLoading(true)
    onLoadingChange(true)
    router.push(newUrl)
  }

  const getCurrencyName = (currencyCode: string) => {
    return CURRENCIES.find((c) => c.code === currencyCode)?.name || currencyCode
  }

  return (
    <button
      onClick={handleClick}
      disabled={isAnyLoading}
      className="group relative w-full text-left disabled:cursor-wait"
    >
      <div
        className={`relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-xl bg-white p-5 transition-all duration-300 dark:bg-gray-900 ${
          isSelected
            ? "border-2 border-indigo-500 shadow-lg shadow-indigo-500/20 dark:border-indigo-400 dark:shadow-indigo-400/20"
            : "border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:hover:border-gray-700"
        }`}
      >
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-3">
              <div className="min-w-0">
                <h3 className="flex min-w-0 items-center gap-2">
                  <span className="flex-shrink-0 text-base font-semibold text-gray-500 dark:text-slate-500">
                    #{price.id}
                  </span>
                  <span
                    className={`min-w-0 flex-1 truncate text-base font-semibold ${
                      isSelected
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-900 group-hover:text-gray-900 dark:text-gray-100 dark:group-hover:text-white"
                    }`}
                  >
                    {price.name}
                  </span>
                </h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-1.5">
                  <p className="text-lg font-semibold text-yellow-700 dark:text-yellow-500">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: price.currency,
                    }).format(price.amount)}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-slate-500">
                    {price.currency} - {getCurrencyName(price.currency)}
                  </p>
                </div>

                {price.salesChannels && price.salesChannels.length > 0 && (
                  <p className="truncate text-xs text-gray-500 dark:text-slate-500">
                    {price.salesChannels.length} sales{" "}
                    {price.salesChannels.length === 1 ? "channel" : "channels"}
                    {price.isDateBased &&
                      price.dateRanges &&
                      price.dateRanges.length > 0 &&
                      ` • ${price.dateRanges.length} date ${price.dateRanges.length === 1 ? "range" : "ranges"}`}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {price.isDateBased && (
                  <Badge variant="neutral">Date-based</Badge>
                )}
              </div>
            </div>

            <div
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                isSelected
                  ? "scale-100 bg-indigo-600 dark:bg-indigo-500"
                  : "scale-90 bg-gray-100 opacity-0 group-hover:scale-100 group-hover:opacity-100 dark:bg-gray-700"
              }`}
            >
              <RiCheckLine
                className={`h-4 w-4 transition-all ${
                  isSelected
                    ? "scale-100 text-white"
                    : "scale-75 text-gray-600 dark:text-gray-300"
                }`}
              />
            </div>
          </div>
        </div>

        <div
          className={`absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 transition-opacity duration-300 ${
            isSelected ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm dark:bg-gray-950/90">
          <RiLoader4Line className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
        </div>
      )}
    </button>
  )
}
