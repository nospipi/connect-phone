// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/offers/select/page.tsx

import { RiArrowLeftLine, RiSimCardLine } from "@remixicon/react"
import Link from "next/link"
import { getAllEsimOffersPaginated } from "@/app/(backend)/server_actions/esim-offers/getAllEsimOffersPaginated"
import { getCountryById } from "@/app/(backend)/server_actions/countries/getCountryById"
import { getSalesChannelById } from "@/app/(backend)/server_actions/sales-channels/getSalesChannelById"
import { getPriceById } from "@/app/(backend)/server_actions/prices/getPriceById"
import OfferGrid from "./OfferGrid.client"
import { Pagination } from "@/components/common/pagination/Pagination"
import { PendingOverlay } from "@/components/common/PendingOverlay"
import SelectAllCheckbox from "./SelectAllCheckbox.client"
import OffersFilters from "./OffersFilters.client"

//----------------------------------------------------------------------

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    previousPage?: string
    esimOfferIds?: string
    multipleSelection?: string
    targetField?: string
    minDataInGb?: string
    maxDataInGb?: string
    isUnlimitedData?: string
    minDurationInDays?: string
    maxDurationInDays?: string
    countryIds?: string
    salesChannelIds?: string
    priceIds?: string
    [key: string]: string | undefined
  }>
}

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams
  const page = params.page || "1"
  const search = params.search || ""
  const previousPage = params.previousPage || "/inventory/offers"
  const selectedParam = params.esimOfferIds || ""
  const multipleSelection = params.multipleSelection === "true"
  const targetField = params.targetField || "esimOfferIds"
  const minDataInGb = params.minDataInGb
  const maxDataInGb = params.maxDataInGb
  const isUnlimitedData = params.isUnlimitedData === "true" ? true : undefined
  const minDurationInDays = params.minDurationInDays
  const maxDurationInDays = params.maxDurationInDays
  const countryIds = params.countryIds
  const salesChannelIds = params.salesChannelIds
  const priceIds = params.priceIds

  const countryIdsArray = countryIds
    ? countryIds.split(",").map(Number).filter(Boolean)
    : []
  const salesChannelIdsArray = salesChannelIds
    ? salesChannelIds.split(",").map(Number).filter(Boolean)
    : []
  const priceIdsArray = priceIds
    ? priceIds.split(",").map(Number).filter(Boolean)
    : []

  const selectedCountries = await Promise.all(
    countryIdsArray.map(async (id) => {
      try {
        return await getCountryById(id)
      } catch (error) {
        console.error(`Failed to fetch country ${id}:`, error)
        return null
      }
    }),
  ).then((results) => results.filter((c) => c !== null))

  const selectedSalesChannels = await Promise.all(
    salesChannelIdsArray.map(async (id) => {
      try {
        return await getSalesChannelById(id)
      } catch (error) {
        console.error(`Failed to fetch sales channel ${id}:`, error)
        return null
      }
    }),
  ).then((results) => results.filter((sc) => sc !== null))

  const selectedPrices = await Promise.all(
    priceIdsArray.map(async (id) => {
      try {
        return await getPriceById(id)
      } catch (error) {
        console.error(`Failed to fetch price ${id}:`, error)
        return null
      }
    }),
  ).then((results) => results.filter((p) => p !== null))

  const formData: Record<string, string> = {}
  const excludedParams = [
    "page",
    "search",
    "previousPage",
    "esimOfferIds",
    "multipleSelection",
    "targetField",
    "minDataInGb",
    "maxDataInGb",
    "isUnlimitedData",
    "minDurationInDays",
    "maxDurationInDays",
    "countryIds",
    "salesChannelIds",
    "priceIds",
  ]
  Object.entries(params).forEach(([key, value]) => {
    if (!excludedParams.includes(key) && value !== undefined) {
      formData[key] = value
    }
  })

  const selectedIds = selectedParam
    ? selectedParam.split(",").map(Number).filter(Boolean)
    : []

  const offersData = await getAllEsimOffersPaginated({
    page,
    search,
    minDataInGb: minDataInGb ? Number(minDataInGb) : undefined,
    maxDataInGb: maxDataInGb ? Number(maxDataInGb) : undefined,
    isUnlimitedData,
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
    isUnlimitedData: params.isUnlimitedData || "",
    minDurationInDays: minDurationInDays || "",
    maxDurationInDays: maxDurationInDays || "",
    countries: selectedCountries,
    salesChannels: selectedSalesChannels,
    prices: selectedPrices,
  }

  const buildConfirmUrl = () => {
    const urlParams = new URLSearchParams()
    Object.entries(formData).forEach(([key, value]) => {
      urlParams.set(key, value)
    })
    urlParams.set(targetField, selectedIds.join(","))

    const separator = previousPage.includes("?") ? "&" : "?"
    return `${previousPage}${separator}${urlParams.toString()}`
  }

  const buildClearUrl = () => {
    const urlParams = new URLSearchParams()
    urlParams.set("previousPage", previousPage)
    urlParams.set("targetField", targetField)
    urlParams.set("multipleSelection", String(multipleSelection))
    Object.entries(formData).forEach(([key, value]) => {
      urlParams.set(key, value)
    })
    urlParams.set("page", page)
    if (search) urlParams.set("search", search)
    if (minDataInGb) urlParams.set("minDataInGb", minDataInGb)
    if (maxDataInGb) urlParams.set("maxDataInGb", maxDataInGb)
    if (params.isUnlimitedData)
      urlParams.set("isUnlimitedData", params.isUnlimitedData)
    if (minDurationInDays) urlParams.set("minDurationInDays", minDurationInDays)
    if (maxDurationInDays) urlParams.set("maxDurationInDays", maxDurationInDays)
    if (countryIds) urlParams.set("countryIds", countryIds)
    if (salesChannelIds) urlParams.set("salesChannelIds", salesChannelIds)
    if (priceIds) urlParams.set("priceIds", priceIds)
    return `/inventory/offers/select?${urlParams.toString()}`
  }

  const buildBackUrl = () => {
    const urlParams = new URLSearchParams()
    Object.entries(formData).forEach(([key, value]) => {
      urlParams.set(key, value)
    })

    if (selectedParam) {
      urlParams.set(targetField, selectedParam)
    }

    if (urlParams.toString() === "") {
      return previousPage
    }

    const separator = previousPage.includes("?") ? "&" : "?"
    return `${previousPage}${separator}${urlParams.toString()}`
  }

  const paginationParams: Record<string, string> = {
    previousPage,
    targetField,
    multipleSelection: String(multipleSelection),
    ...formData,
  }
  if (search) paginationParams.search = search
  if (selectedParam) paginationParams.esimOfferIds = selectedParam
  if (minDataInGb) paginationParams.minDataInGb = minDataInGb
  if (maxDataInGb) paginationParams.maxDataInGb = maxDataInGb
  if (params.isUnlimitedData)
    paginationParams.isUnlimitedData = params.isUnlimitedData
  if (minDurationInDays) paginationParams.minDurationInDays = minDurationInDays
  if (maxDurationInDays) paginationParams.maxDurationInDays = maxDurationInDays
  if (countryIds) paginationParams.countryIds = countryIds
  if (salesChannelIds) paginationParams.salesChannelIds = salesChannelIds
  if (priceIds) paginationParams.priceIds = priceIds

  return (
    <div className="relative flex h-full flex-col gap-2 overflow-hidden">
      <div className="flex border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <Link
          href={buildBackUrl()}
          className="flex items-center justify-center px-4 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-300"
        >
          <RiArrowLeftLine className="h-4 w-4" />
        </Link>

        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between gap-4">
            <div className="py-4 pl-4">
              <h1 className="whitespace-nowrap text-lg font-semibold text-gray-900 dark:text-gray-50">
                Select eSIM Offer
              </h1>
              <p className="whitespace-nowrap text-sm text-gray-500">
                {multipleSelection
                  ? "Choose eSIM offers from your inventory"
                  : "Choose one eSIM offer from your inventory"}
              </p>
            </div>

            {selectedIds.length > 0 && (
              <div className="mr-4 whitespace-nowrap rounded-full bg-indigo-50 px-3 py-1 dark:bg-indigo-900/30">
                <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                  {selectedIds.length} selected
                </span>
              </div>
            )}
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center justify-end gap-2 pb-4 pr-4">
              <PendingOverlay mode="navigation" href={buildClearUrl()}>
                <button
                  type="button"
                  className="border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 hover:border-red-400 hover:bg-red-100 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:border-red-600/50 dark:hover:bg-red-800/30"
                >
                  Clear Selection
                </button>
              </PendingOverlay>
              <PendingOverlay mode="navigation" href={buildConfirmUrl()}>
                <button
                  type="button"
                  className="border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  Confirm Selection
                </button>
              </PendingOverlay>
            </div>
          )}
        </div>
      </div>

      <div className="my-2 flex flex-wrap items-center gap-2 px-5">
        <SelectAllCheckbox
          items={items}
          selectedIds={selectedIds}
          multipleSelection={multipleSelection}
          page={page}
          search={search}
          previousPage={previousPage}
          targetField={targetField}
          formData={formData}
        />

        <OffersFilters
          currentFilters={currentFilters}
          previousPage={previousPage}
          targetField={targetField}
          multipleSelection={multipleSelection}
          selectedParam={selectedParam}
          formData={formData}
        />
      </div>

      {items.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800/50">
              <RiSimCardLine className="h-8 w-8 text-gray-400 dark:text-slate-600" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-slate-200">
              No eSIM offers found
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-500">
              {search
                ? "Try adjusting your search or filters"
                : "Create an eSIM offer to get started"}
            </p>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto px-5">
            <OfferGrid
              items={items}
              selectedIds={selectedIds}
              multipleSelection={multipleSelection}
              page={page}
              search={search}
              previousPage={previousPage}
              targetField={targetField}
              formData={formData}
            />
          </div>
        </div>
      )}

      <Pagination
        meta={meta}
        searchParams={paginationParams}
        itemLabel="eSIM offers"
        basePath="/inventory/offers/select"
      />
    </div>
  )
}

export default Page
