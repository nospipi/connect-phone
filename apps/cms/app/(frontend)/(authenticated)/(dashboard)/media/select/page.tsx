// apps/cms/app/(frontend)/(authenticated)/(dashboard)/media/select/page.tsx
import { RiArrowLeftLine, RiCheckLine, RiImageLine } from "@remixicon/react"
import Link from "next/link"
import Image from "next/image"
import { getAllMediaPaginated } from "@/app/(backend)/server_actions/media/getAllMediaPaginated"
import SearchForm from "./SearchForm"
import PaginationControls from "./PaginationControls"

//----------------------------------------------------------------------

interface PageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    previousPage?: string
    selected?: string
  }>
}

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams
  const page = params.page || "1"
  const search = params.search || ""
  const previousPage = params.previousPage || "/media"
  const selectedParam = params.selected || ""
  const selectedIds = selectedParam
    ? selectedParam.split(",").map(Number).filter(Boolean)
    : []

  const mediaData = await getAllMediaPaginated({
    page,
    search,
  })

  const { items, meta } = mediaData

  // Build URL helper
  const buildUrl = (newSelectedIds: number[]) => {
    const urlParams = new URLSearchParams()
    urlParams.set("page", page)
    if (search) urlParams.set("search", search)
    urlParams.set("previousPage", previousPage)
    if (newSelectedIds.length > 0) {
      urlParams.set("selected", newSelectedIds.join(","))
    }
    return `/media/select?${urlParams.toString()}`
  }

  // Build confirmation URL
  const buildConfirmUrl = () => {
    const separator = previousPage.includes("?") ? "&" : "?"
    return `${previousPage}${separator}mediaIds=${selectedIds.join(",")}`
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-950 dark:to-gray-900/50">
      {/* Header */}
      <div className="relative border-b border-gray-200/80 bg-white/80 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/80">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="relative flex items-center gap-4">
          <Link
            href={previousPage}
            className="flex h-full items-center justify-center px-4 py-2 text-gray-500 transition-colors hover:bg-gray-100/50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-900/50 dark:hover:text-gray-300"
          >
            <RiArrowLeftLine className="h-4 w-4" />
          </Link>
          <div className="flex flex-1 items-center justify-between py-4 pr-4">
            <div>
              <h1 className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-lg font-semibold text-transparent dark:from-gray-50 dark:to-gray-300">
                Select Media
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose images from your library
              </p>
            </div>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-indigo-50 px-3 py-1 dark:bg-indigo-900/30">
                  <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                    {selectedIds.length} selected
                  </span>
                </div>
                <Link
                  href={buildConfirmUrl()}
                  className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/40"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="relative">Confirm Selection</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="border-b border-gray-200/80 bg-white/50 p-4 backdrop-blur-sm dark:border-gray-800/80 dark:bg-gray-950/50">
        <SearchForm
          currentSearch={search}
          currentPage={page}
          previousPage={previousPage}
          selectedParam={selectedParam}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
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
              const newSelectedIds = isSelected
                ? selectedIds.filter((id) => id !== media.id)
                : [...selectedIds, media.id]

              return (
                <Link
                  key={media.id}
                  href={buildUrl(newSelectedIds)}
                  className="group relative"
                >
                  {/* Card Container */}
                  <div
                    className={`relative aspect-square overflow-hidden rounded-xl transition-all duration-300 ${
                      isSelected
                        ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-950"
                        : "ring-1 ring-gray-200/50 hover:ring-gray-300 dark:ring-gray-800/50 dark:hover:ring-gray-700"
                    }`}
                  >
                    {/* Image */}
                    <div className="relative h-full w-full overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                      <Image
                        src={media.url}
                        alt={media.description || "Media"}
                        fill
                        className="object-cover p-2"
                      />
                    </div>

                    {/* Gradient Overlays */}
                    <div className="absolute inset-2 rounded-lg bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div
                      className={`absolute inset-2 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 transition-opacity duration-300 ${
                        isSelected ? "opacity-100" : "opacity-0"
                      }`}
                    />

                    {/* Selection Indicator */}
                    <div className="absolute right-3 top-3">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 ${
                          isSelected
                            ? "scale-100 bg-indigo-600 shadow-lg shadow-indigo-500/50"
                            : "scale-90 bg-white/20 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                        }`}
                      >
                        <RiCheckLine
                          className={`h-4 w-4 transition-all ${
                            isSelected
                              ? "scale-100 text-white"
                              : "scale-75 text-white"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    {media.description && (
                      <div className="absolute bottom-2 left-2 right-2 translate-y-full rounded-lg bg-gradient-to-t from-black/90 to-transparent p-3 transition-transform duration-300 group-hover:translate-y-0">
                        <p className="truncate text-xs font-medium text-white">
                          {media.description}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <PaginationControls
          meta={meta}
          currentPage={Number(page)}
          currentSearch={search}
          previousPage={previousPage}
          selectedParam={selectedParam}
        />
      )}
    </div>
  )
}

export default Page
