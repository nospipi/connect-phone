// apps/cms/app/(frontend)/(authenticated)/(dashboard)/media/select/PaginationControls.tsx
import Link from "next/link"
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react"
import { PaginationMeta } from "@/app/(backend)/server_actions/types"

//----------------------------------------------------------------------

interface PaginationControlsProps {
  meta: PaginationMeta
  currentPage: number
  currentSearch: string
  previousPage: string
  selectedParam: string
}

export default function PaginationControls({
  meta,
  currentPage,
  currentSearch,
  previousPage,
  selectedParam,
}: PaginationControlsProps) {
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams()
    params.set("page", String(page))
    if (currentSearch) params.set("search", currentSearch)
    params.set("previousPage", previousPage)
    if (selectedParam) params.set("selected", selectedParam)
    return `/media/select?${params.toString()}`
  }

  return (
    <div className="border-t border-gray-200/80 bg-white/80 p-4 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/80">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            Page {meta.currentPage}
          </span>{" "}
          of {meta.totalPages} • {meta.totalItems} total
        </div>

        <div className="flex items-center gap-2">
          {currentPage > 1 ? (
            <Link
              href={buildPageUrl(currentPage - 1)}
              className="dark:hover:bg-gray-750 group inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <RiArrowLeftSLine className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Previous
            </Link>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200/50 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-400 dark:border-gray-800/50 dark:bg-gray-900 dark:text-gray-600">
              <RiArrowLeftSLine className="h-4 w-4" />
              Previous
            </div>
          )}

          {currentPage < meta.totalPages ? (
            <Link
              href={buildPageUrl(currentPage + 1)}
              className="dark:hover:bg-gray-750 group inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              Next
              <RiArrowRightSLine className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200/50 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-400 dark:border-gray-800/50 dark:bg-gray-900 dark:text-gray-600">
              Next
              <RiArrowRightSLine className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
