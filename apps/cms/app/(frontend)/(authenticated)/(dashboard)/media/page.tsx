// apps/cms/app/(frontend)/(authenticated)/(dashboard)/media/page.tsx
import { getAllMediaPaginated } from "@/app/(backend)/server_actions/media/getAllMediaPaginated"
import { Button } from "@/components/common/Button"
import Link from "next/link"
import Image from "next/image"
import { RiImageLine, RiSearchLine, RiAddLine } from "@remixicon/react"
import MediaItemDrawer from "./MediaItemDrawer"

//------------------------------------------------------------

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const { page = "1", search = "", selectedId } = await searchParams

  const mediaData = await getAllMediaPaginated({
    page,
    search,
  })

  const { items, meta } = mediaData
  const hasPreviousPage = meta.currentPage > 1
  const hasNextPage = meta.currentPage < meta.totalPages
  const hasActiveFilters = search !== ""

  const selectedMedia = selectedId
    ? items.find((item) => item.id === Number(selectedId))
    : null

  return (
    <div className="relative flex h-full flex-col gap-2 overflow-hidden py-4 pl-5">
      {/* Header with Actions */}
      <div className="flex items-center justify-between pr-5">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Media Library
        </h1>
        <Link href="/media/upload">
          <Button variant="primary" className="gap-2">
            <RiAddLine />
            <span>Upload Media</span>
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="my-2 flex flex-col gap-3 pr-2 sm:flex-row sm:items-center sm:justify-between">
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
                placeholder="Search by description..."
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
                <Link href="/media">
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

      {items.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800/50">
              <RiImageLine className="h-8 w-8 text-gray-400 dark:text-slate-600" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-slate-200">
              No media found
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-500">
              {search
                ? "Try adjusting your search to see more results"
                : "Get started by uploading your first media file"}
            </p>
          </div>
        </div>
      )}

      {/* Media Grid */}
      {items.length > 0 && (
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto pr-5">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
              {items.map((media) => (
                <Link
                  key={media.id}
                  href={`/media?page=${page}${search ? `&search=${search}` : ""}&selectedId=${media.id}`}
                  className="group relative"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl ring-1 ring-gray-200/50 transition-all duration-300 hover:ring-gray-300 dark:ring-gray-800/50 dark:hover:ring-gray-700">
                    <div className="relative h-full w-full overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                      <Image
                        src={media.url}
                        alt={media.description || "Media"}
                        fill
                        className="object-cover p-2"
                        style={{
                          borderRadius: 17,
                        }}
                      />
                    </div>

                    <div className="absolute inset-2 rounded-lg bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="absolute bottom-2 left-2 right-2 translate-y-full rounded-lg bg-gradient-to-t from-black/90 to-transparent p-3 transition-transform duration-300 group-hover:translate-y-0">
                      <p className="truncate text-xs font-medium text-white">
                        {media.description || "No description"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
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
                of {meta.totalItems} items
              </span>
            </div>

            {/* Desktop pagination */}
            <div className="hidden items-center gap-2 sm:flex">
              {hasPreviousPage ? (
                <Link href={`?page=1${search ? `&search=${search}` : ""}`}>
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
                  href={`?page=${meta.currentPage - 1}${search ? `&search=${search}` : ""}`}
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
                  href={`?page=${meta.currentPage + 1}${search ? `&search=${search}` : ""}`}
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
                  href={`?page=${meta.totalPages}${search ? `&search=${search}` : ""}`}
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
                  href={`?page=${meta.currentPage - 1}${search ? `&search=${search}` : ""}`}
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
                  href={`?page=${meta.currentPage + 1}${search ? `&search=${search}` : ""}`}
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

      {/* Media Item Drawer */}
      {selectedMedia && (
        <MediaItemDrawer
          media={selectedMedia}
          currentPage={page}
          currentSearch={search}
        />
      )}
    </div>
  )
}

export default Page
