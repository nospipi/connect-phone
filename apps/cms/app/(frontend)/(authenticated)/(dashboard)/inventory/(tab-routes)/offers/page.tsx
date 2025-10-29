// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/(tab-routes)/offers/page.tsx

import { getAllEsimOffersPaginated } from "@/app/(backend)/server_actions/esim-offers/getAllEsimOffersPaginated"
import { getCountriesByIds } from "@/app/(backend)/server_actions/countries/getCountriesByIds"
import { getSalesChannelsByIds } from "@/app/(backend)/server_actions/sales-channels/getSalesChannelsByIds"
import { getPricesByIds } from "@/app/(backend)/server_actions/prices/getPricesByIds"
import { RiSmartphoneLine } from "@remixicon/react"
import { Pagination } from "@/components/common/pagination/Pagination"
import OfferListItem from "./OfferListItem"
import OffersFilters from "./OffersFilters.client"

//------------------------------------------------------------

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const params = await searchParams
  const {
    page = "1",
    search = "",
    minDataInGb,
    maxDataInGb,
    isUnlimitedData,
    minDurationInDays,
    maxDurationInDays,
    countryIds,
    salesChannelIds,
    priceIds,
  } = params

  const countryIdsArray = countryIds
    ? countryIds.split(",").map(Number).filter(Boolean)
    : []
  const salesChannelIdsArray = salesChannelIds
    ? salesChannelIds.split(",").map(Number).filter(Boolean)
    : []
  const priceIdsArray = priceIds
    ? priceIds.split(",").map(Number).filter(Boolean)
    : []

  const [selectedCountries, selectedSalesChannels, selectedPrices] =
    await Promise.all([
      getCountriesByIds(countryIdsArray),
      getSalesChannelsByIds(salesChannelIdsArray),
      getPricesByIds(priceIdsArray),
    ])

  const offersData = await getAllEsimOffersPaginated({
    page,
    search,
    minDataInGb: minDataInGb ? Number(minDataInGb) : undefined,
    maxDataInGb: maxDataInGb ? Number(maxDataInGb) : undefined,
    isUnlimitedData: isUnlimitedData === "true" ? true : undefined,
    minDurationInDays: minDurationInDays
      ? Number(minDurationInDays)
      : undefined,
    maxDurationInDays: maxDurationInDays
      ? Number(maxDurationInDays)
      : undefined,
    countryIds: countryIdsArray.length > 0 ? countryIdsArray : undefined,
    salesChannelIds:
      salesChannelIdsArray.length > 0 ? salesChannelIdsArray : undefined,
    priceIds: priceIdsArray.length > 0 ? priceIdsArray : undefined,
  })

  const { items, meta } = offersData

  const currentFilters = {
    search,
    minDataInGb: minDataInGb || "",
    maxDataInGb: maxDataInGb || "",
    isUnlimitedData: isUnlimitedData || "",
    minDurationInDays: minDurationInDays || "",
    maxDurationInDays: maxDurationInDays || "",
    countries: selectedCountries,
    salesChannels: selectedSalesChannels,
    prices: selectedPrices,
  }

  const hasActiveFilters =
    search !== "" ||
    minDataInGb !== undefined ||
    maxDataInGb !== undefined ||
    isUnlimitedData !== undefined ||
    minDurationInDays !== undefined ||
    maxDurationInDays !== undefined ||
    countryIdsArray.length > 0 ||
    salesChannelIdsArray.length > 0 ||
    priceIdsArray.length > 0

  return (
    <div className="relative flex h-full flex-col gap-2 overflow-hidden">
      <OffersFilters currentFilters={currentFilters} />

      {items.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800/50">
              <RiSmartphoneLine className="h-8 w-8 text-gray-400 dark:text-slate-600" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-slate-200">
              No eSIM offers found
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-500">
              {hasActiveFilters
                ? "Try adjusting your filters to see more results"
                : "Get started by creating your first eSIM offer"}
            </p>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="flex-1 overflow-hidden">
          <div className="h-full divide-y divide-gray-200 overflow-auto px-5 dark:divide-slate-800/30">
            {items.map((offer) => (
              <OfferListItem key={offer.id} offer={offer} />
            ))}
          </div>
        </div>
      )}

      <Pagination meta={meta} searchParams={params} itemLabel="offers" />
    </div>
  )
}

export default Page
