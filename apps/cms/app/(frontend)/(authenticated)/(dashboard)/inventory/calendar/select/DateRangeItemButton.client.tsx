// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/calendar/select/DateRangeItemButton.client.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RiCheckLine, RiLoader4Line, RiCalendarLine } from "@remixicon/react"
import { IDateRange } from "@connect-phone/shared-types"

//------------------------------------------------------------

interface DateRangeItemButtonProps {
  dateRange: IDateRange
  isSelected: boolean
  newUrl: string
  isAnyLoading: boolean
  onLoadingChange: (loading: boolean) => void
}

export default function DateRangeItemButton({
  dateRange,
  isSelected,
  newUrl,
  isAnyLoading,
  onLoadingChange,
}: DateRangeItemButtonProps) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const duration = calculateDuration(dateRange.startDate, dateRange.endDate)

  return (
    <button
      onClick={handleClick}
      disabled={isAnyLoading}
      className="group relative w-full text-left disabled:cursor-wait"
    >
      <div
        className={`relative overflow-hidden rounded-xl border bg-white p-5 transition-all duration-300 dark:bg-gray-900 ${
          isSelected
            ? "border-gray-200 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-50 dark:border-gray-800 dark:shadow-indigo-400/20 dark:ring-indigo-400 dark:ring-offset-gray-950"
            : "border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:hover:border-gray-700"
        }`}
      >
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
                <RiCalendarLine className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="flex min-w-0 items-center gap-2">
                  <span className="flex-shrink-0 text-base font-semibold text-gray-500 dark:text-slate-500">
                    #{dateRange.id}
                  </span>
                  <span
                    className={`min-w-0 flex-1 truncate text-base font-semibold ${
                      isSelected
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-900 group-hover:text-gray-900 dark:text-gray-100 dark:group-hover:text-white"
                    }`}
                  >
                    {dateRange.name}
                  </span>
                </h3>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Start</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {formatDate(dateRange.startDate)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">End</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {formatDate(dateRange.endDate)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <div
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  isSelected
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {duration} {duration === 1 ? "day" : "days"}
              </div>
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
