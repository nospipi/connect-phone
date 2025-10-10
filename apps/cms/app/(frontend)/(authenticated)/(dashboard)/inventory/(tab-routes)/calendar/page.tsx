// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/(tab-routes)/calendar/page.tsx

import { getAllDateRangesPaginated } from "@/app/(backend)/server_actions/date-ranges/getAllDateRangesPaginated"
import { Button } from "@/components/common/Button"
import Link from "next/link"
import { RiAddLine, RiCalendarEventLine } from "@remixicon/react"
import { IDateRange } from "@connect-phone/shared-types"
import { format } from "date-fns"

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

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const { page = "1", date } = await searchParams

  const paginationParams: {
    page: string | number
    date?: string
  } = {
    page: page,
  }

  if (date && date !== "undefined") {
    paginationParams.date = date
  }

  const dateRangesResponse = await getAllDateRangesPaginated(paginationParams)

  const items: IDateRange[] = dateRangesResponse?.items || []
  const meta = dateRangesResponse?.meta
  const hasPreviousPage = meta?.currentPage > 1
  const hasNextPage = meta?.currentPage < meta?.totalPages
  const hasActiveFilters = !!date && date !== "undefined"

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden py-4 pl-5">
      {/* Filters Bar */}
      <div className="my-2 flex flex-col gap-3 pr-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <form
            method="GET"
            className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-1 flex-col gap-3 sm:max-w-lg sm:flex-row sm:items-center">
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

      <Link href="/inventory/calendar/create-new">
        <Button variant="primary" className="mb-4 gap-2">
          <RiAddLine />
          <span>Create Date Range</span>
        </Button>
      </Link>

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

      {/* Date Ranges List */}
      {items.length > 0 && (
        <div className="flex-1 overflow-hidden">
          <div className="h-full divide-y divide-gray-200 overflow-auto pr-5 dark:divide-slate-800/30">
            {items.map((dateRange: IDateRange) => (
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
                          <p className="truncate text-sm font-medium text-gray-900 group-hover:text-gray-700 dark:text-slate-200 dark:group-hover:text-slate-100">
                            {format(
                              new Date(dateRange.startDate),
                              "MMM dd, yyyy",
                            )}{" "}
                            -{" "}
                            {format(
                              new Date(dateRange.endDate),
                              "MMM dd, yyyy",
                            )}
                          </p>
                          <p className="truncate text-sm text-gray-600 group-hover:text-gray-500 dark:text-slate-400 dark:group-hover:text-slate-300">
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
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="border-t border-gray-200 pr-5 pt-4 dark:border-slate-800/50">
          <div className="flex items-center justify-center sm:justify-between">
            <div className="hidden items-center gap-4 text-sm text-gray-500 sm:flex dark:text-slate-500">
              <span>
                Showing {(meta.currentPage - 1) * meta.itemsPerPage + 1} to{" "}
                {Math.min(
                  meta.currentPage * meta.itemsPerPage,
                  meta.totalItems,
                )}{" "}
                of {meta.totalItems} date ranges
              </span>
            </div>

            {/* Desktop pagination */}
            <div className="hidden items-center gap-2 sm:flex">
              {hasPreviousPage ? (
                <Link
                  href={`?page=1${date && date !== "undefined" ? `&date=${date}` : ""}`}
                >
                  <Button
                    variant="secondary"
                    className="border-gray-300 bg-gray-50 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
                  >
                    First
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-gray-200 bg-gray-100 text-sm text-gray-400 dark:border-slate-800/50 dark:bg-slate-900/50 dark:text-slate-600"
                >
                  First
                </Button>
              )}
              {hasPreviousPage ? (
                <Link
                  href={`?page=${meta.currentPage - 1}${date && date !== "undefined" ? `&date=${date}` : ""}`}
                >
                  <Button
                    variant="secondary"
                    className="border-gray-300 bg-gray-50 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
                  >
                    Previous
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-gray-200 bg-gray-100 text-sm text-gray-400 dark:border-slate-800/50 dark:bg-slate-900/50 dark:text-slate-600"
                >
                  Previous
                </Button>
              )}
              <span className="px-3 text-sm text-gray-600 dark:text-slate-400">
                Page {meta.currentPage} of {meta.totalPages}
              </span>
              {hasNextPage ? (
                <Link
                  href={`?page=${meta.currentPage + 1}${date && date !== "undefined" ? `&date=${date}` : ""}`}
                >
                  <Button
                    variant="secondary"
                    className="border-gray-300 bg-gray-50 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
                  >
                    Next
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-gray-200 bg-gray-100 text-sm text-gray-400 dark:border-slate-800/50 dark:bg-slate-900/50 dark:text-slate-600"
                >
                  Next
                </Button>
              )}
              {hasNextPage ? (
                <Link
                  href={`?page=${meta.totalPages}${date && date !== "undefined" ? `&date=${date}` : ""}`}
                >
                  <Button
                    variant="secondary"
                    className="border-gray-300 bg-gray-50 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
                  >
                    Last
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-gray-200 bg-gray-100 text-sm text-gray-400 dark:border-slate-800/50 dark:bg-slate-900/50 dark:text-slate-600"
                >
                  Last
                </Button>
              )}
            </div>

            {/* Mobile pagination */}
            <div className="flex items-center gap-2 sm:hidden">
              {hasPreviousPage ? (
                <Link
                  href={`?page=${meta.currentPage - 1}${date && date !== "undefined" ? `&date=${date}` : ""}`}
                >
                  <Button
                    variant="secondary"
                    className="border-gray-300 bg-gray-50 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
                  >
                    Previous
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-gray-200 bg-gray-100 text-sm text-gray-400 dark:border-slate-800/50 dark:bg-slate-900/50 dark:text-slate-600"
                >
                  Previous
                </Button>
              )}
              <span className="px-3 text-sm text-gray-600 dark:text-slate-400">
                {meta.currentPage}/{meta.totalPages}
              </span>
              {hasNextPage ? (
                <Link
                  href={`?page=${meta.currentPage + 1}${date && date !== "undefined" ? `&date=${date}` : ""}`}
                >
                  <Button
                    variant="secondary"
                    className="border-gray-300 bg-gray-50 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
                  >
                    Next
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-gray-200 bg-gray-100 text-sm text-gray-400 dark:border-slate-800/50 dark:bg-slate-900/50 dark:text-slate-600"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Page
