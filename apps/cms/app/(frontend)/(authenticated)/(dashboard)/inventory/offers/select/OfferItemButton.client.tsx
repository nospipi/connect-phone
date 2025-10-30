// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/offers/select/OfferItemButton.client.tsx

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RiCheckLine, RiLoader4Line, RiSimCardLine } from "@remixicon/react"
import { IEsimOffer } from "@connect-phone/shared-types"
import { Badge } from "@/components/common/Badge"

//------------------------------------------------------------

interface OfferItemButtonProps {
  offer: IEsimOffer
  isSelected: boolean
  newUrl: string
  isAnyLoading: boolean
  onLoadingChange: (loading: boolean) => void
}

export default function OfferItemButton({
  offer,
  isSelected,
  newUrl,
  isAnyLoading,
  onLoadingChange,
}: OfferItemButtonProps) {
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
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isSelected
                      ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                      : "bg-gray-100 text-gray-600 group-hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-gray-700"
                  }`}
                >
                  <RiSimCardLine className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="flex min-w-0 items-center gap-2">
                    <span className="flex-shrink-0 text-base font-semibold text-gray-500 dark:text-slate-500">
                      #{offer.id}
                    </span>
                    <span
                      className={`min-w-0 flex-1 truncate text-base font-semibold ${
                        isSelected
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-900 group-hover:text-gray-900 dark:text-gray-100 dark:group-hover:text-white"
                      }`}
                    >
                      {offer.title}
                    </span>
                  </h3>
                </div>
              </div>

              <div className="space-y-2">
                <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {offer.descriptionText}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={offer.isActive ? "success" : "error"}>
                  {offer.isActive ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="neutral">
                  {offer.durationInDays}{" "}
                  {offer.durationInDays === 1 ? "day" : "days"}
                </Badge>
                {offer.isUnlimitedData ? (
                  <Badge variant="success">Unlimited Data</Badge>
                ) : (
                  <Badge variant="neutral">{offer.dataInGb} GB</Badge>
                )}
                {offer.countries && offer.countries.length > 0 && (
                  <Badge variant="neutral">
                    {offer.countries.length}{" "}
                    {offer.countries.length === 1 ? "country" : "countries"}
                  </Badge>
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
