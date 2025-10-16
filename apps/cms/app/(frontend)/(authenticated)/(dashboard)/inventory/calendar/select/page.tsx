// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/calendar/select/page.tsx

import { RiArrowLeftLine, RiCalendarLine, RiCloseLine } from "@remixicon/react"
import Link from "next/link"
import { getAllDateRangesPaginated } from "@/app/(backend)/server_actions/date-ranges/getAllDateRangesPaginated"
import SearchForm from "./SearchForm"
import DateRangeGrid from "./DateRangeGrid.client"
import { Pagination } from "@/components/common/pagination/Pagination"

//----------------------------------------------------------------------

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    previousPage?: string
    dateRangeIds?: string
    multipleSelection?: string
    targetField?: string
    [key: string]: string | undefined
  }>
}

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams
  const page = params.page || "1"
  const search = params.search || ""
  const previousPage = params.previousPage || "/inventory/calendar"
  const selectedParam = params.dateRangeIds || ""
  const multipleSelection = params.multipleSelection === "true"
  const targetField = params.targetField || "dateRangeIds"

  const formData: Record<string, string> = {}
  const excludedParams = [
    "page",
    "search",
    "previousPage",
    "dateRangeIds",
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

  const dateRangeData = await getAllDateRangesPaginated({
    page,
    search,
  })

  const { items, meta } = dateRangeData

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
    return `/inventory/calendar/select?${urlParams.toString()}`
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
  if (selectedParam) paginationParams.dateRangeIds = selectedParam

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-950 dark:to-gray-900/50">
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
                Select Date Range
              </h1>
              <p className="whitespace-nowrap text-sm text-gray-500">
                {multipleSelection
                  ? "Choose date ranges from your calendar"
                  : "Choose one date range from your calendar"}
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
              <Link
                href={buildClearUrl()}
                className="relative inline-flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <RiCloseLine className="h-4 w-4" />
                <span className="relative">Clear Selection</span>
              </Link>
              <Link
                href={buildConfirmUrl()}
                className="relative overflow-hidden whitespace-nowrap rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25"
              >
                <span className="relative">Confirm Selection</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="border-b border-gray-200/80 bg-white/50 p-3 backdrop-blur-sm dark:border-gray-800/80 dark:bg-gray-950/50">
        <div className="flex items-center gap-4">
          <SearchForm
            currentSearch={search}
            previousPage={previousPage}
            selectedParam={selectedParam}
            multipleSelection={multipleSelection}
            targetField={targetField}
            formData={formData}
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden py-2">
        <div className="flex-1 overflow-auto px-3 py-1">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-6">
              <div className="rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200/50 p-8 dark:from-gray-800/50 dark:to-gray-900/50">
                <RiCalendarLine className="h-20 w-20 text-gray-400 dark:text-gray-600" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  No date ranges found
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {search
                    ? "Try adjusting your search"
                    : "Create a date range to get started"}
                </p>
              </div>
            </div>
          ) : (
            <DateRangeGrid
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
        itemLabel="date ranges"
        basePath="/inventory/calendar/select"
      />
    </div>
  )
}

export default Page
