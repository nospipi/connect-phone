// apps/cms/app/(frontend)/(authenticated)/(dashboard)/media/select/page.tsx
import { RiArrowLeftLine, RiImageLine, RiCloseLine } from "@remixicon/react"
import Link from "next/link"
import { getAllMediaPaginated } from "@/app/(backend)/server_actions/media/getAllMediaPaginated"
import SearchForm from "./SearchForm"
import { Button } from "@/components/common/Button"
import MediaItemButton from "./MediaItemButton.client"

//----------------------------------------------------------------------

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    previousPage?: string
    selected?: string
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
  const selectedParam = params.selected || ""
  const multipleSelection = params.multipleSelection === "true"
  const targetField = params.targetField || "mediaIds"

  // Extract all other form data (excluding media select specific params)
  const formData: Record<string, string> = {}
  const excludedParams = [
    "page",
    "search",
    "previousPage",
    "selected",
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
  const hasPreviousPage = meta.currentPage > 1
  const hasNextPage = meta.currentPage < meta.totalPages

  const buildBaseParams = () => {
    const urlParams = new URLSearchParams()
    urlParams.set("previousPage", previousPage)
    urlParams.set("targetField", targetField)
    urlParams.set("multipleSelection", String(multipleSelection))
    // Add all form data
    Object.entries(formData).forEach(([key, value]) => {
      urlParams.set(key, value)
    })
    return urlParams
  }

  const buildUrl = (newSelectedIds: number[]) => {
    const urlParams = buildBaseParams()
    urlParams.set("page", page)
    if (search) urlParams.set("search", search)
    urlParams.set("selected", newSelectedIds.join(","))
    return `/media/select?${urlParams.toString()}`
  }

  const buildConfirmUrl = () => {
    const urlParams = new URLSearchParams()
    // Add all form data back
    Object.entries(formData).forEach(([key, value]) => {
      urlParams.set(key, value)
    })
    // Set the target field with selected media IDs
    urlParams.set(targetField, selectedIds.join(","))

    const separator = previousPage.includes("?") ? "&" : "?"
    return `${previousPage}${separator}${urlParams.toString()}`
  }

  const buildClearUrl = () => {
    const urlParams = buildBaseParams()
    urlParams.set("page", page)
    if (search) urlParams.set("search", search)
    return `/media/select?${urlParams.toString()}`
  }

  const buildBackUrl = () => {
    const urlParams = new URLSearchParams()
    // Add all form data back
    Object.entries(formData).forEach(([key, value]) => {
      urlParams.set(key, value)
    })

    if (Object.keys(formData).length === 0) {
      return previousPage
    }

    const separator = previousPage.includes("?") ? "&" : "?"
    return `${previousPage}${separator}${urlParams.toString()}`
  }

  const buildPaginationUrl = (targetPage: number | string) => {
    const urlParams = buildBaseParams()
    urlParams.set("page", String(targetPage))
    if (search) urlParams.set("search", search)
    if (selectedParam) urlParams.set("selected", selectedParam)
    return `/media/select?${urlParams.toString()}`
  }

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
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-[300px] flex-1">
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
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
              {items.map((media) => {
                const isSelected = selectedIds.includes(media.id)

                const newSelectedIds = multipleSelection
                  ? isSelected
                    ? selectedIds.filter((id) => id !== media.id)
                    : [...selectedIds, media.id]
                  : isSelected
                    ? []
                    : [media.id]

                return (
                  <MediaItemButton
                    key={media.id}
                    media={media}
                    isSelected={isSelected}
                    newUrl={buildUrl(newSelectedIds)}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>

      {meta.totalPages > 1 && (
        <div className="border-t border-gray-200/80 bg-white/80 p-4 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/80">
          <div className="flex items-center justify-center sm:justify-between">
            <div className="hidden items-center gap-4 text-sm text-gray-500 sm:flex dark:text-gray-400">
              <span>
                Showing {(meta.currentPage - 1) * meta.itemsPerPage + 1} to{" "}
                {Math.min(
                  meta.currentPage * meta.itemsPerPage,
                  meta.totalItems,
                )}{" "}
                of {meta.totalItems} items
              </span>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              {hasPreviousPage ? (
                <Link href={buildPaginationUrl(1)}>
                  <Button
                    variant="secondary"
                    className="border-gray-300 bg-gray-50 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-700/50 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:border-gray-600/50 dark:hover:bg-gray-700/50"
                  >
                    First
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-gray-200/50 bg-gray-100 text-sm text-gray-400 dark:border-gray-800/50 dark:bg-gray-900 dark:text-gray-600"
                >
                  First
                </Button>
              )}
              {hasPreviousPage ? (
                <Link href={buildPaginationUrl(meta.currentPage - 1)}>
                  <Button
                    variant="secondary"
                    className="border-gray-300 bg-gray-50 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-700/50 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:border-gray-600/50 dark:hover:bg-gray-700/50"
                  >
                    Previous
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-gray-200/50 bg-gray-100 text-sm text-gray-400 dark:border-gray-800/50 dark:bg-gray-900 dark:text-gray-600"
                >
                  Previous
                </Button>
              )}
              <span className="px-3 text-sm text-gray-600 dark:text-gray-400">
                Page {meta.currentPage} of {meta.totalPages}
              </span>
              {hasNextPage ? (
                <Link href={buildPaginationUrl(meta.currentPage + 1)}>
                  <Button
                    variant="secondary"
                    className="border-gray-300 bg-gray-50 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-700/50 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:border-gray-600/50 dark:hover:bg-gray-700/50"
                  >
                    Next
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-gray-200/50 bg-gray-100 text-sm text-gray-400 dark:border-gray-800/50 dark:bg-gray-900 dark:text-gray-600"
                >
                  Next
                </Button>
              )}
              {hasNextPage ? (
                <Link href={buildPaginationUrl(meta.totalPages)}>
                  <Button
                    variant="secondary"
                    className="border-gray-300 bg-gray-50 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-700/50 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:border-gray-600/50 dark:hover:bg-gray-700/50"
                  >
                    Last
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-gray-200/50 bg-gray-100 text-sm text-gray-400 dark:border-gray-800/50 dark:bg-gray-900 dark:text-gray-600"
                >
                  Last
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2 sm:hidden">
              {hasPreviousPage ? (
                <Link href={buildPaginationUrl(meta.currentPage - 1)}>
                  <Button
                    variant="secondary"
                    className="border-gray-300 bg-gray-50 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-700/50 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:border-gray-600/50 dark:hover:bg-gray-700/50"
                  >
                    Previous
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-gray-200/50 bg-gray-100 text-sm text-gray-400 dark:border-gray-800/50 dark:bg-gray-900 dark:text-gray-600"
                >
                  Previous
                </Button>
              )}
              <span className="px-3 text-sm text-gray-600 dark:text-gray-400">
                {meta.currentPage}/{meta.totalPages}
              </span>
              {hasNextPage ? (
                <Link href={buildPaginationUrl(meta.currentPage + 1)}>
                  <Button
                    variant="secondary"
                    className="border-gray-300 bg-gray-50 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-700/50 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:border-gray-600/50 dark:hover:bg-gray-700/50"
                  >
                    Next
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-gray-200/50 bg-gray-100 text-sm text-gray-400 dark:border-gray-800/50 dark:bg-gray-900 dark:text-gray-600"
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
