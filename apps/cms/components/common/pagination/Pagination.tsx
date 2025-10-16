// apps/cms/components/common/Pagination.tsx
import Link from "next/link"
import { Button } from "@/components/common/Button"
import DotsLoading from "../DotsLoading"

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
}

export function Pagination({
  meta,
  searchParams = {},
  itemLabel = "items",
}: PaginationProps) {
  const hasPreviousPage = meta.currentPage > 1
  const hasNextPage = meta.currentPage < meta.totalPages

  const buildUrl = (targetPage: number) => {
    const params = new URLSearchParams()
    params.set("page", targetPage.toString())

    // Add all other search params except page
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "page" && value) {
        params.set(key, value)
      }
    })

    return `?${params.toString()}`
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
            <Link href={buildUrl(1)}>
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
            <Link href={buildUrl(meta.currentPage - 1)}>
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
            <Link href={buildUrl(meta.currentPage + 1)}>
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
            <Link href={buildUrl(meta.totalPages)}>
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
            <Link href={buildUrl(meta.currentPage - 1)}>
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
            <Link href={buildUrl(meta.currentPage + 1)}>
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
  )
}
