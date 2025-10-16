// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/(tab-routes)/prices/page.tsx

import { getAllPricesPaginated } from "@/app/(backend)/server_actions/prices/getAllPricesPaginated"
import { Button } from "@/components/common/Button"
import Link from "next/link"
import { RiSearchLine, RiCoinsLine, RiAddLine } from "@remixicon/react"
import { IPrice } from "@connect-phone/shared-types"
import { Badge } from "@/components/common/Badge"
import { Pagination } from "@/components/common/pagination/Pagination"

//------------------------------------------------------------

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const params = await searchParams
  const { page = "1", search = "" } = params

  const pricesData = await getAllPricesPaginated({
    page,
    search,
  })

  const { items, meta } = pricesData
  const hasActiveFilters = search !== ""

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      {/* Filters Bar */}
      <div className="my-2 flex flex-col gap-3 px-5 pr-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <form
            method="GET"
            className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="relative flex-1 sm:max-w-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <RiSearchLine className="h-4 w-4 text-gray-500 dark:text-slate-500" />
              </div>
              <input
                autoFocus
                type="text"
                name="search"
                placeholder="Search prices..."
                defaultValue={search}
                className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 outline-none focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-transparent dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-slate-700/50"
              />
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
                <Link href="/inventory/prices">
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

      <div className="px-5">
        <Link href="/inventory/prices/create-new">
          <Button variant="primary" className="mb-4 gap-2">
            <RiAddLine />
            <span>Create Price</span>
          </Button>
        </Link>
      </div>

      {items.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800/50">
              <RiCoinsLine className="h-8 w-8 text-gray-400 dark:text-slate-600" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-slate-200">
              No prices found
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-500">
              {hasActiveFilters
                ? "Try adjusting your search to see more results"
                : "Get started by creating your first price"}
            </p>
          </div>
        </div>
      )}

      {/* Prices List */}
      {items.length > 0 && (
        <div className="flex-1 overflow-hidden">
          <div className="h-full divide-y divide-gray-200 overflow-auto px-5 dark:divide-slate-800/30">
            {items.map((price: IPrice) => (
              <Link
                key={price.id}
                href={`/inventory/prices/${price.id}`}
                className="block"
              >
                <div className="duration-2000 group py-4 transition-all">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex min-w-0 items-center gap-2">
                            <div className="flex min-w-0 items-center gap-2">
                              <span className="flex-shrink-0 text-base font-medium text-gray-500 dark:text-slate-500">
                                #{price.id}
                              </span>
                              <p className="min-w-0 flex-1 truncate text-base font-medium text-gray-900 group-hover:text-gray-700 dark:text-slate-200 dark:group-hover:text-slate-100">
                                {price.name}
                              </p>
                            </div>
                            {price.isDateBased && (
                              <Badge variant="neutral">Date-based</Badge>
                            )}
                          </div>
                          <p className="mt-1 truncate text-sm font-semibold text-gray-900 group-hover:text-gray-700 dark:text-slate-300 dark:group-hover:text-slate-200">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: price.currency,
                            }).format(price.amount)}
                          </p>
                          {price.salesChannels &&
                            price.salesChannels.length > 0 && (
                              <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-slate-500">
                                {price.salesChannels.length} sales{" "}
                                {price.salesChannels.length === 1
                                  ? "channel"
                                  : "channels"}
                                {price.isDateBased &&
                                  price.dateRanges &&
                                  price.dateRanges.length > 0 &&
                                  ` • ${price.dateRanges.length} date ${price.dateRanges.length === 1 ? "range" : "ranges"}`}
                              </p>
                            )}
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

      <Pagination meta={meta} searchParams={params} itemLabel="prices" />
    </div>
  )
}

export default Page
