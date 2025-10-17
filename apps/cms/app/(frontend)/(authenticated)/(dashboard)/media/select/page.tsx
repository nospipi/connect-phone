// apps/cms/app/(frontend)/(authenticated)/(dashboard)/media/select/page.tsx

import { RiArrowLeftLine, RiImageLine } from "@remixicon/react"
import Link from "next/link"
import { getAllMediaPaginated } from "@/app/(backend)/server_actions/media/getAllMediaPaginated"
import SearchForm from "./SearchForm"
import MediaGrid from "./MediaGrid.client"
import { Pagination } from "@/components/common/pagination/Pagination"
import { PendingOverlay } from "@/components/common/PendingOverlay"

//----------------------------------------------------------------------

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    previousPage?: string
    mediaIds?: string
    multipleSelection?: string
    targetField?: string
    [key: string]: string | undefined
  }>
}

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams
  const page = params.page || "1"
  const search = params.search || ""
  const previousPage = params.previousPage || "/media"
  const selectedParam = params.mediaIds || ""
  const multipleSelection = params.multipleSelection === "true"
  const targetField = params.targetField || "mediaIds"

  const formData: Record<string, string> = {}
  const excludedParams = [
    "page",
    "search",
    "previousPage",
    "mediaIds",
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

  const mediaData = await getAllMediaPaginated({
    page,
    search,
  })

  const { items, meta } = mediaData

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
    return `/media/select?${urlParams.toString()}`
  }

  const buildClearSearchUrl = () => {
    const urlParams = new URLSearchParams()
    urlParams.set("previousPage", previousPage)
    urlParams.set("targetField", targetField)
    urlParams.set("multipleSelection", String(multipleSelection))
    Object.entries(formData).forEach(([key, value]) => {
      urlParams.set(key, value)
    })
    if (selectedParam) urlParams.set("mediaIds", selectedParam)
    return `/media/select?${urlParams.toString()}`
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
  if (selectedParam) paginationParams.mediaIds = selectedParam

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
                Select Media
              </h1>
              <p className="whitespace-nowrap text-sm text-gray-500">
                {multipleSelection
                  ? "Choose images from your library"
                  : "Choose one image from your library"}
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

      <div className="bg-white/50 p-3 backdrop-blur-sm dark:bg-gray-950/50">
        <div className="flex items-center gap-4">
          <form id="search-form" className="flex flex-1 items-center gap-2">
            <input type="hidden" name="previousPage" value={previousPage} />
            <input type="hidden" name="targetField" value={targetField} />
            <input
              type="hidden"
              name="multipleSelection"
              value={String(multipleSelection)}
            />
            {Object.entries(formData).map(([key, value]) => (
              <input key={key} type="hidden" name={key} value={value} />
            ))}
            {selectedParam && (
              <input type="hidden" name="mediaIds" value={selectedParam} />
            )}
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by description..."
              className="flex-1 border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none focus:border-blue-500 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-slate-700/50"
            />
            <PendingOverlay mode="form-navigation" formId="search-form">
              <button
                type="submit"
                form="search-form"
                className="border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
              >
                Search
              </button>
            </PendingOverlay>
            {search && (
              <PendingOverlay mode="navigation" href={buildClearSearchUrl()}>
                <button
                  type="button"
                  className="border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 hover:border-red-400 hover:bg-red-100 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:border-red-600/50 dark:hover:bg-red-800/30"
                >
                  Clear
                </button>
              </PendingOverlay>
            )}
          </form>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden py-2">
        <div className="flex-1 overflow-auto px-3 py-1">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-6">
              <div className="rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200/50 p-8 dark:from-gray-800/50 dark:to-gray-900/50">
                <RiImageLine className="h-20 w-20 text-gray-400 dark:text-gray-600" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  No media found
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {search
                    ? "Try adjusting your search"
                    : "Upload some images to get started"}
                </p>
              </div>
            </div>
          ) : (
            <MediaGrid
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
        itemLabel="media"
        basePath="/media/select"
      />
    </div>
  )
}

export default Page
