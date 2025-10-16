// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/(tab-routes)/calendar/page.tsx

import { getAllDateRangesPaginated } from "@/app/(backend)/server_actions/date-ranges/getAllDateRangesPaginated"
import { Button } from "@/components/common/Button"
import Link from "next/link"
import { RiAddLine, RiCalendarEventLine } from "@remixicon/react"
import { IDateRange } from "@connect-phone/shared-types"
import { format } from "date-fns"
import { Pagination } from "@/components/common/pagination/Pagination"

//------------------------------------------------------------

const calculateDuration = (startDate: string, endDate: string) => {
  const [startYear, startMonth, startDay] = startDate.split("-").map(Number)
  const [endYear, endMonth, endDay] = endDate.split("-").map(Number)

  const start = new Date(startYear, startMonth - 1, startDay)
  const end = new Date(endYear, endMonth - 1, endDay)

  return (
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  )
}

const groupDateRangesByYearMonth = (dateRanges: IDateRange[]) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const presentDateRanges = dateRanges.filter((dr) => {
    const [endYear, endMonth, endDay] = dr.endDate.split("-").map(Number)
    const endDate = new Date(endYear, endMonth - 1, endDay)
    return endDate >= today
  })

  const grouped: Record<string, Record<string, IDateRange[]>> = {}

  presentDateRanges.forEach((dr) => {
    const [year, month] = dr.startDate.split("-")
    const monthName = format(new Date(dr.startDate), "MMMM")

    if (!grouped[year]) {
      grouped[year] = {}
    }
    if (!grouped[year][monthName]) {
      grouped[year][monthName] = []
    }
    grouped[year][monthName].push(dr)
  })

  return grouped
}

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const params = await searchParams
  const { page = "1", search = "", date } = params

  const paginationParams: {
    page: string | number
    date?: string
    search?: string
  } = {
    page: page,
  }

  if (date && date !== "undefined") {
    paginationParams.date = date
  }

  if (search && search !== "undefined") {
    paginationParams.search = search
  }

  const dateRangesResponse = await getAllDateRangesPaginated(paginationParams)

  const items: IDateRange[] = dateRangesResponse?.items || []
  const meta = dateRangesResponse?.meta
  const hasPreviousPage = meta?.currentPage > 1
  const hasNextPage = meta?.currentPage < meta?.totalPages
  const hasActiveFilters =
    (!!date && date !== "undefined") || (!!search && search !== "undefined")

  const groupedDateRanges = groupDateRangesByYearMonth(items)
  const years = Object.keys(groupedDateRanges).sort(
    (a, b) => Number(b) - Number(a),
  )

  return (
    <div className="relative flex h-full flex-col gap-2 overflow-hidden">
      {/* Filters Bar */}
      <div className="my-2 flex flex-col gap-3 px-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <form
            method="GET"
            className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-1 flex-col gap-3 sm:max-w-2xl sm:flex-row sm:items-center">
              <div className="w-full sm:max-w-xs">
                <input
                  type="text"
                  name="search"
                  defaultValue={search && search !== "undefined" ? search : ""}
                  placeholder="Search by name..."
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-transparent dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-slate-700/50"
                />
              </div>
              <div className="w-full sm:max-w-xs">
                <input
                  type="date"
                  name="date"
                  defaultValue={date && date !== "undefined" ? date : ""}
                  placeholder="Filter by date"
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-transparent dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-slate-700/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 sm:justify-start">
              <Button
                type="submit"
                variant="secondary"
                className="border-gray-300 bg-gray-50 px-4 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
              >
                Apply
              </Button>
              {hasActiveFilters && (
                <Link href="/inventory/calendar">
                  <Button
                    variant="secondary"
                    className="border-red-300 bg-red-50 px-4 text-sm text-red-700 hover:border-red-400 hover:bg-red-100 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:border-red-600/50 dark:hover:bg-red-800/30"
                  >
                    Clear
                  </Button>
                </Link>
              )}
            </div>
          </form>
        </div>
      </div>
      <div className="px-3">
        <Link href="/inventory/calendar/create-new">
          <Button variant="primary" className="mb-4 gap-2">
            <RiAddLine />
            <span>Create Date Range</span>
          </Button>
        </Link>
      </div>

      {items.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800/50">
              <RiCalendarEventLine className="h-8 w-8 text-gray-400 dark:text-slate-600" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-slate-200">
              No date ranges found
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-500">
              {hasActiveFilters
                ? "Try adjusting your filters to see more results"
                : "Get started by creating your first date range"}
            </p>
          </div>
        </div>
      )}

      {/* Date Ranges List with Sticky Headers */}
      {items.length > 0 && years.length > 0 && (
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto px-4">
            {years.map((year) => {
              const months = Object.keys(groupedDateRanges[year])
              return (
                <div key={year}>
                  {/* Year Sticky Header */}
                  <div className="sticky top-0 z-20 bg-white py-3 dark:bg-gray-950">
                    <h2 className="border-l-4 border-yellow-500 pl-3 text-xl font-bold text-gray-900 dark:text-slate-100">
                      {year}
                    </h2>
                  </div>

                  {months.map((month) => {
                    const dateRanges = groupedDateRanges[year][month]
                    return (
                      <div key={`${year}-${month}`} className="mb-6">
                        {/* Month Sticky Header */}
                        <div className="sticky top-[52px] z-10 border-b border-gray-200 bg-white pb-2 dark:border-slate-800/50 dark:bg-gray-950">
                          <h3 className="text-sm font-semibold uppercase tracking-wide text-yellow-700 dark:text-yellow-500">
                            {month}
                          </h3>
                        </div>

                        {/* Date Ranges */}
                        <div className="divide-y divide-gray-200 dark:divide-slate-800/30">
                          {dateRanges.map((dateRange: IDateRange) => (
                            <Link
                              key={dateRange.id}
                              href={`/inventory/calendar/${dateRange.id}`}
                              className="block"
                            >
                              <div className="duration-2000 group py-4 transition-all">
                                <div className="flex items-center justify-between gap-4">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between">
                                      <div className="min-w-0 flex-1">
                                        <p className="truncate text-base font-medium text-gray-900 group-hover:text-gray-700 dark:text-slate-200 dark:group-hover:text-slate-100">
                                          <span className="font-semibold text-gray-500 dark:text-slate-500">
                                            #{dateRange.id}
                                          </span>{" "}
                                          {dateRange.name}
                                        </p>
                                        <p className="mt-1 truncate text-sm text-gray-600 group-hover:text-gray-500 dark:text-slate-400 dark:group-hover:text-slate-300">
                                          {format(
                                            new Date(dateRange.startDate),
                                            "dd MMMM, yyyy",
                                          )}{" "}
                                          -{" "}
                                          {format(
                                            new Date(dateRange.endDate),
                                            "dd MMMM, yyyy",
                                          )}
                                        </p>
                                        <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-slate-500">
                                          Duration:{" "}
                                          {calculateDuration(
                                            dateRange.startDate,
                                            dateRange.endDate,
                                          )}{" "}
                                          days
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {items.length > 0 && years.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800/50">
              <RiCalendarEventLine className="h-8 w-8 text-gray-400 dark:text-slate-600" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-slate-200">
              No present or future date ranges
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-500">
              All date ranges have ended. Create new ones to see them here.
            </p>
          </div>
        </div>
      )}

      <Pagination meta={meta} searchParams={params} itemLabel="date ranges" />
    </div>
  )
}

export default Page
