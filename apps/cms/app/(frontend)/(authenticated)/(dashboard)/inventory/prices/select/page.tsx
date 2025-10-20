// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/prices/select/page.tsx

import { RiArrowLeftLine, RiCoinsLine } from "@remixicon/react"
import Link from "next/link"
import { getAllPricesPaginated } from "@/app/(backend)/server_actions/prices/getAllPricesPaginated"
import { getDateRangeById } from "@/app/(backend)/server_actions/date-ranges/getDateRangeById"
import { getSalesChannelById } from "@/app/(backend)/server_actions/sales-channels/getSalesChannelById"
import { Currency } from "@connect-phone/shared-types"
import PriceGrid from "./PriceGrid.client"
import { Pagination } from "@/components/common/pagination/Pagination"
import { PendingOverlay } from "@/components/common/PendingOverlay"
import PricesFilters from "./PricesFilters.client"
import SelectAllCheckbox from "./SelectAllCheckbox.client"

//----------------------------------------------------------------------

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    previousPage?: string
    priceIds?: string
    multipleSelection?: string
    targetField?: string
    minAmount?: string
    maxAmount?: string
    currencies?: string
    dateRangeIds?: string
    salesChannelIds?: string
    [key: string]: string | undefined
  }>
}

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams
  const page = params.page || "1"
  const search = params.search || ""
  const previousPage = params.previousPage || "/inventory/prices"
  const selectedParam = params.priceIds || ""
  const multipleSelection = params.multipleSelection === "true"
  const targetField = params.targetField || "priceIds"
  const minAmount = params.minAmount
  const maxAmount = params.maxAmount
  const currencies = params.currencies
  const dateRangeIds = params.dateRangeIds
  const salesChannelIds = params.salesChannelIds

  const currenciesArray = currencies
    ? currencies.split(",").filter(Boolean)
    : []
  const dateRangeIdsArray = dateRangeIds
    ? dateRangeIds.split(",").map(Number).filter(Boolean)
    : []
  const salesChannelIdsArray = salesChannelIds
    ? salesChannelIds.split(",").map(Number).filter(Boolean)
    : []

  const selectedDateRanges = await Promise.all(
    dateRangeIdsArray.map(async (id) => {
      try {
        return await getDateRangeById(id)
      } catch (error) {
        console.error(`Failed to fetch date range ${id}:`, error)
        return null
      }
    }),
  ).then((results) => results.filter((dr) => dr !== null))

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

  const formData: Record<string, string> = {}
  const excludedParams = [
    "page",
    "search",
    "previousPage",
    "priceIds",
    "multipleSelection",
    "targetField",
  ]
  Object.entries(params).forEach(([key, value]) => {
    if (!excludedParams.includes(key) && value !== undefined) {
      formData[key] = value
    }
  })

  const selectedIds = selectedParam
    ? selectedParam.split(",").map(Number).filter(Boolean)
    : []

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

  const currentFilters = {
    search,
    minAmount: minAmount || "",
    maxAmount: maxAmount || "",
    currencies: currenciesArray,
    dateRanges: selectedDateRanges,
    salesChannels: selectedSalesChannels,
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
    return `/inventory/prices/select?${urlParams.toString()}`
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
  if (selectedParam) paginationParams.priceIds = selectedParam

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-950 dark:to-gray-900/50">
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
                Select Price
              </h1>
              <p className="whitespace-nowrap text-sm text-gray-500">
                {multipleSelection
                  ? "Choose prices from your inventory"
                  : "Choose one price from your inventory"}
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

      <div className="flex flex-col gap-2 px-2 pt-2">
        <PricesFilters currentFilters={currentFilters} />

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
      </div>

      <div className="flex flex-1 overflow-hidden py-2">
        <div className="flex-1 overflow-auto px-3 py-1">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-6">
              <div className="rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200/50 p-8 dark:from-gray-800/50 dark:to-gray-900/50">
                <RiCoinsLine className="h-20 w-20 text-gray-400 dark:text-gray-600" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  No prices found
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {search
                    ? "Try adjusting your search"
                    : "Create a price to get started"}
                </p>
              </div>
            </div>
          ) : (
            <PriceGrid
              items={items}
              selectedIds={selectedIds}
              multipleSelection={multipleSelection}
              page={page}
              search={search}
              previousPage={previousPage}
              targetField={targetField}
              formData={formData}
            />
          )}
        </div>
      </div>

      <Pagination
        meta={meta}
        searchParams={paginationParams}
        itemLabel="prices"
        basePath="/inventory/prices/select"
      />
    </div>
  )
}

export default Page
