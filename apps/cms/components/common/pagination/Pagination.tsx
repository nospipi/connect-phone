import { PendingOverlay } from "@/components/common/PendingOverlay"

//------------------------------------------------------------

interface PaginationMeta {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
}

interface PaginationProps {
  meta: PaginationMeta
  searchParams?: Record<string, string | undefined>
  itemLabel?: string
  basePath?: string
}

export function Pagination({
  meta,
  searchParams = {},
  itemLabel = "items",
  basePath,
}: PaginationProps) {
  const hasPreviousPage = meta.currentPage > 1
  const hasNextPage = meta.currentPage < meta.totalPages

  const buildUrl = (targetPage: number) => {
    const params = new URLSearchParams()
    params.set("page", targetPage.toString())

    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "page" && value) {
        params.set(key, value)
      }
    })

    const queryString = params.toString()

    if (basePath) {
      return `${basePath}?${queryString}`
    }

    return `?${queryString}`
  }

  if (meta.totalPages <= 1) {
    return null
  }

  return (
    <div className="border-t border-gray-200 p-5 dark:border-slate-800/50">
      <div className="flex items-center justify-center sm:justify-between">
        <div className="hidden items-center gap-4 text-sm text-gray-500 sm:flex dark:text-slate-500">
          <span>
            Showing {(meta.currentPage - 1) * meta.itemsPerPage + 1} to{" "}
            {Math.min(meta.currentPage * meta.itemsPerPage, meta.totalItems)} of{" "}
            {meta.totalItems} {itemLabel}
          </span>
        </div>

        {/* Desktop pagination */}
        <div className="hidden items-center gap-2 sm:flex">
          {hasPreviousPage ? (
            <PendingOverlay mode="navigation" href={buildUrl(1)}>
              <button className="inline-flex items-center justify-center border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50">
                First
              </button>
            </PendingOverlay>
          ) : (
            <button
              disabled
              className="inline-flex items-center justify-center border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-400 dark:border-slate-800/50 dark:bg-slate-900/50 dark:text-slate-600"
            >
              First
            </button>
          )}
          {hasPreviousPage ? (
            <PendingOverlay
              mode="navigation"
              href={buildUrl(meta.currentPage - 1)}
            >
              <button className="inline-flex items-center justify-center border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50">
                Previous
              </button>
            </PendingOverlay>
          ) : (
            <button
              disabled
              className="inline-flex items-center justify-center border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-400 dark:border-slate-800/50 dark:bg-slate-900/50 dark:text-slate-600"
            >
              Previous
            </button>
          )}
          <span className="px-3 text-sm text-gray-600 dark:text-slate-400">
            Page {meta.currentPage} of {meta.totalPages}
          </span>
          {hasNextPage ? (
            <PendingOverlay
              mode="navigation"
              href={buildUrl(meta.currentPage + 1)}
            >
              <button className="inline-flex items-center justify-center border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50">
                Next
              </button>
            </PendingOverlay>
          ) : (
            <button
              disabled
              className="inline-flex items-center justify-center border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-400 dark:border-slate-800/50 dark:bg-slate-900/50 dark:text-slate-600"
            >
              Next
            </button>
          )}
          {hasNextPage ? (
            <PendingOverlay mode="navigation" href={buildUrl(meta.totalPages)}>
              <button className="inline-flex items-center justify-center border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50">
                Last
              </button>
            </PendingOverlay>
          ) : (
            <button
              disabled
              className="inline-flex items-center justify-center border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-400 dark:border-slate-800/50 dark:bg-slate-900/50 dark:text-slate-600"
            >
              Last
            </button>
          )}
        </div>

        {/* Mobile pagination */}
        <div className="flex items-center gap-2 sm:hidden">
          {hasPreviousPage ? (
            <PendingOverlay
              mode="navigation"
              href={buildUrl(meta.currentPage - 1)}
            >
              <button className="inline-flex items-center justify-center border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50">
                Previous
              </button>
            </PendingOverlay>
          ) : (
            <button
              disabled
              className="inline-flex items-center justify-center border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-400 dark:border-slate-800/50 dark:bg-slate-900/50 dark:text-slate-600"
            >
              Previous
            </button>
          )}
          <span className="px-3 text-sm text-gray-600 dark:text-slate-400">
            {meta.currentPage}/{meta.totalPages}
          </span>
          {hasNextPage ? (
            <PendingOverlay
              mode="navigation"
              href={buildUrl(meta.currentPage + 1)}
            >
              <button className="inline-flex items-center justify-center border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50">
                Next
              </button>
            </PendingOverlay>
          ) : (
            <button
              disabled
              className="inline-flex items-center justify-center border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-400 dark:border-slate-800/50 dark:bg-slate-900/50 dark:text-slate-600"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
