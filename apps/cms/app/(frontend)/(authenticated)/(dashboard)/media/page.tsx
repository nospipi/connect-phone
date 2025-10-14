// apps/cms/app/(frontend)/(authenticated)/(dashboard)/media/page.tsx

import { getAllMediaPaginated } from "@/app/(backend)/server_actions/media/getAllMediaPaginated"
import { Button } from "@/components/common/Button"
import Link from "next/link"
import { RiImageLine, RiSearchLine, RiAddLine } from "@remixicon/react"
import MediaItemDrawer from "./MediaItemDrawer"
import MediaItem from "./MediaItemButton.client"

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const { page = "1", search = "" } = await searchParams

  const mediaData = await getAllMediaPaginated({
    page,
    search,
  })

  const { items, meta } = mediaData
  const hasPreviousPage = meta.currentPage > 1
  const hasNextPage = meta.currentPage < meta.totalPages
  const hasActiveFilters = search !== ""

  return (
    <div className="relative flex h-full flex-col gap-3 pt-5">
      {/* HEADER + FILTERS */}
      <div className="flex flex-col gap-3 px-5">
        <div className="flex items-center justify-between">
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

        <form
          method="GET"
          className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
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
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 outline-none focus:border-blue-500 focus:outline-none focus:ring-0 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-slate-700/50"
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

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-auto">
        {items.length === 0 ? (
          <div className="flex h-full items-center justify-center">
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
        ) : (
          <div className="grid grid-cols-2 gap-4 px-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
            {items.map((media) => (
              <div key={media.id}>
                <MediaItem media={media} />
                <MediaItemDrawer media={media} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {meta && meta.totalPages > 1 && (
        <div className="border-t border-gray-200 p-5 dark:border-slate-800/50">
          <div className="flex items-center justify-center sm:justify-between">
            {/* Desktop */}
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

            <div className="hidden items-center gap-2 sm:flex">
              {[
                { label: "First", page: 1, enabled: hasPreviousPage },
                {
                  label: "Previous",
                  page: meta.currentPage - 1,
                  enabled: hasPreviousPage,
                },
                {
                  label: "Next",
                  page: meta.currentPage + 1,
                  enabled: hasNextPage,
                },
                { label: "Last", page: meta.totalPages, enabled: hasNextPage },
              ].map(({ label, page, enabled }) =>
                enabled ? (
                  <Link
                    key={label}
                    href={`?page=${page}${search ? `&search=${search}` : ""}`}
                  >
                    <Button
                      variant="secondary"
                      className="border-gray-300 bg-gray-50 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
                    >
                      {label}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    key={label}
                    variant="secondary"
                    disabled
                    className="border-gray-200 bg-gray-100 text-sm text-gray-400 dark:border-slate-800/50 dark:bg-slate-900/50 dark:text-slate-600"
                  >
                    {label}
                  </Button>
                ),
              )}
              <span className="px-3 text-sm text-gray-600 dark:text-slate-400">
                Page {meta.currentPage} of {meta.totalPages}
              </span>
            </div>

            {/* Mobile */}
            <div className="flex items-center gap-2 sm:hidden">
              {hasPreviousPage ? (
                <Link
                  href={`?page=${meta.currentPage - 1}${search ? `&search=${search}` : ""}`}
                >
                  <Button variant="secondary">Previous</Button>
                </Link>
              ) : (
                <Button variant="secondary" disabled>
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
                  <Button variant="secondary">Next</Button>
                </Link>
              ) : (
                <Button variant="secondary" disabled>
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
