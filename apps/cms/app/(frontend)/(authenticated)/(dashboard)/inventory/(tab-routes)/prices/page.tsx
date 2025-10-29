// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/(tab-routes)/prices/page.tsx
import { getAllPricesPaginated } from "@/app/(backend)/server_actions/prices/getAllPricesPaginated"
import { getDateRangesByIds } from "@/app/(backend)/server_actions/date-ranges/getDateRangesByIds"
import { getSalesChannelsByIds } from "@/app/(backend)/server_actions/sales-channels/getSalesChannelsByIds"
import { RiCoinsLine } from "@remixicon/react"
import { IPrice, Currency, CURRENCIES } from "@connect-phone/shared-types"
import { Badge } from "@/components/common/Badge"
import { Pagination } from "@/components/common/pagination/Pagination"
import Link from "next/link"
import PricesFilters from "./PricesFilters.client"

//------------------------------------------------------------

const getCurrencyName = (currencyCode: string) => {
  return CURRENCIES.find((c) => c.code === currencyCode)?.name || currencyCode
}

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const params = await searchParams
  const {
    page = "1",
    search = "",
    minAmount,
    maxAmount,
    currencies,
    dateRangeIds,
    salesChannelIds,
  } = params

  const currenciesArray = currencies
    ? currencies.split(",").filter(Boolean)
    : []
  const dateRangeIdsArray = dateRangeIds
    ? dateRangeIds.split(",").map(Number).filter(Boolean)
    : []
  const salesChannelIdsArray = salesChannelIds
    ? salesChannelIds.split(",").map(Number).filter(Boolean)
    : []

  const [selectedDateRanges, selectedSalesChannels] = await Promise.all([
    getDateRangesByIds(dateRangeIdsArray),
    getSalesChannelsByIds(salesChannelIdsArray),
  ])

  const pricesData = await getAllPricesPaginated({
    page,
    search,
    minAmount: minAmount ? Number(minAmount) : undefined,
    maxAmount: maxAmount ? Number(maxAmount) : undefined,
    currencies:
      currenciesArray.length > 0 ? (currenciesArray as Currency[]) : undefined,
    dateRangeIds: dateRangeIdsArray.length > 0 ? dateRangeIdsArray : undefined,
    salesChannelIds:
      salesChannelIdsArray.length > 0 ? salesChannelIdsArray : undefined,
  })

  const { items, meta } = pricesData

  const buildPriceUrl = (price: IPrice) => {
    const urlParams = new URLSearchParams()

    urlParams.set("name", price.name)
    urlParams.set("amount", price.amount.toString())
    urlParams.set("currency", price.currency)
    urlParams.set("isDateBased", price.isDateBased.toString())

    if (price.salesChannels && price.salesChannels.length > 0) {
      const salesChannelIds = price.salesChannels.map((sc) => sc.id).join(",")
      urlParams.set("salesChannelIds", salesChannelIds)
    }

    if (price.dateRanges && price.dateRanges.length > 0) {
      const dateRangeIds = price.dateRanges.map((dr) => dr.id).join(",")
      urlParams.set("dateRangeIds", dateRangeIds)
    }

    return `/inventory/prices/${price.id}?${urlParams.toString()}`
  }

  const currentFilters = {
    search,
    minAmount: minAmount || "",
    maxAmount: maxAmount || "",
    currencies: currenciesArray,
    dateRanges: selectedDateRanges,
    salesChannels: selectedSalesChannels,
  }

  const hasActiveFilters =
    search !== "" ||
    minAmount !== undefined ||
    maxAmount !== undefined ||
    currenciesArray.length > 0 ||
    dateRangeIdsArray.length > 0 ||
    salesChannelIdsArray.length > 0

  return (
    <div className="relative flex h-full flex-col gap-2 overflow-hidden">
      <PricesFilters currentFilters={currentFilters} />

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
                ? "Try adjusting your filters to see more results"
                : "Get started by creating your first price"}
            </p>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="flex-1 overflow-hidden">
          <div className="h-full divide-y divide-gray-200 overflow-auto px-5 dark:divide-slate-800/30">
            {items.map((price: IPrice) => (
              <Link
                key={price.id}
                href={buildPriceUrl(price)}
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
                          <div className="mt-1 flex items-baseline gap-1.5">
                            <p className="truncate text-sm font-semibold text-yellow-700 group-hover:underline dark:text-yellow-500">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: price.currency,
                              }).format(price.amount)}
                            </p>
                            <p className="truncate text-xs text-gray-500 dark:text-slate-500">
                              {price.currency} -{" "}
                              {getCurrencyName(price.currency)}
                            </p>
                          </div>
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
