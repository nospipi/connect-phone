// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/countries/select/CountryItemButton.client.tsx

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RiCheckLine, RiLoader4Line } from "@remixicon/react"
import { ICountry } from "@connect-phone/shared-types"
import { Badge } from "@/components/common/Badge"
import Image from "next/image"

//------------------------------------------------------------

interface CountryItemButtonProps {
  country: ICountry
  isSelected: boolean
  newUrl: string
  isAnyLoading: boolean
  onLoadingChange: (loading: boolean) => void
}

export default function CountryItemButton({
  country,
  isSelected,
  newUrl,
  isAnyLoading,
  onLoadingChange,
}: CountryItemButtonProps) {
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

  const flagUrl = country.flagAvatarUrl || country.flagProductImageUrl

  return (
    <button
      onClick={handleClick}
      disabled={isAnyLoading}
      className="group relative w-full text-left disabled:cursor-wait"
    >
      <div
        className={`relative flex h-full min-h-[140px] flex-col overflow-hidden rounded-xl border bg-white p-5 transition-all duration-300 dark:bg-gray-900 ${
          isSelected
            ? "border-gray-200 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-50 dark:border-gray-800 dark:shadow-indigo-400/20 dark:ring-indigo-400 dark:ring-offset-gray-950"
            : "border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:hover:border-gray-700"
        }`}
      >
        <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex-shrink-0">
              {flagUrl ? (
                <div className="relative h-10 w-10 overflow-hidden rounded-full shadow-sm">
                  <Image
                    src={flagUrl}
                    alt={`${country.name} flag`}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold shadow-sm ${
                    isSelected
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                      : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 dark:from-slate-700/60 dark:to-slate-800/60 dark:text-slate-200"
                  }`}
                >
                  {country.code?.toUpperCase() || "??"}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3
                className={`truncate text-base font-semibold ${
                  isSelected
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-900 group-hover:text-gray-900 dark:text-gray-100 dark:group-hover:text-white"
                }`}
              >
                {country.name}
              </h3>
              <p className="truncate text-sm text-gray-600 dark:text-slate-400">
                {country.code?.toUpperCase()}
              </p>
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

        <div className="mt-3 flex items-center gap-2">
          <Badge
            variant="neutral"
            className={
              isSelected
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                : ""
            }
          >
            {country.region?.charAt(0).toUpperCase() +
              country.region?.slice(1).toLowerCase()}
          </Badge>
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
