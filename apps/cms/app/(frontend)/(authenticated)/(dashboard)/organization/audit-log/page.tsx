import { getAllAuditLogsOfOrganizationPaginated } from "@/app/(backend)/server_actions/getAllAuditLogsOfOrganizationPaginated"
import { IAuditLog } from "@connect-phone/shared-types"
import { Card } from "@/components/common/Card"
import { Button } from "@/components/common/Button"
import Link from "next/link"
import { RiNodeTree } from "@remixicon/react"
import { AuditLogItem } from "./AuditLogItem"

const Page = async ({
  //params,
  searchParams,
}: {
  //params: Promise<{ partner_id: string; page: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const { page = "1" } = await searchParams
  console.log("Current page:", page)

  //await new Promise((resolve) => setTimeout(resolve, 50000)) // Simulated delay
  const auditLogsResponse = await getAllAuditLogsOfOrganizationPaginated({
    page: page,
  })
  const auditLogs: IAuditLog[] = auditLogsResponse?.items || []
  //console.log("Audit logs:", auditLogs)
  const meta = auditLogsResponse?.meta
  const hasPreviousPage = meta?.currentPage > 1
  const hasNextPage = meta?.currentPage < meta?.totalPages

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      {auditLogs.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50">
              <RiNodeTree className="h-8 w-8 text-slate-600" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-slate-200">
              No audit logs found
            </h3>
            <p className="text-sm text-slate-500">
              Activity logs will appear here as changes are made to your
              organization
            </p>
          </div>
        </div>
      )}

      {/* Audit Logs List */}
      {auditLogs.length > 0 && (
        <div className="flex-1 overflow-hidden">
          <div className="h-full divide-y divide-slate-800/30 overflow-auto pr-5">
            <div className="relative">
              {/* Main content */}
              <div className="relative space-y-0">
                {auditLogs.map((log: IAuditLog, index) => (
                  <AuditLogItem key={log.id} log={log} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="border-t border-slate-800/50 pr-5 pt-4">
          <div className="flex items-center justify-center sm:justify-between">
            <div className="hidden items-center gap-4 text-sm text-slate-500 sm:flex">
              <span>
                Showing {(meta.currentPage - 1) * meta.itemsPerPage + 1} to{" "}
                {Math.min(
                  meta.currentPage * meta.itemsPerPage,
                  meta.totalItems,
                )}{" "}
                of {meta.totalItems} logs
              </span>
            </div>

            {/* Desktop pagination */}
            <div className="hidden items-center gap-2 sm:flex">
              {hasPreviousPage ? (
                <Link href={`?page=1`}>
                  <Button
                    variant="secondary"
                    className="border-slate-700/50 bg-slate-800/50 text-sm text-slate-300 hover:border-slate-600/50 hover:bg-slate-700/50"
                  >
                    First
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-slate-800/50 bg-slate-900/50 text-sm text-slate-600"
                >
                  First
                </Button>
              )}
              {hasPreviousPage ? (
                <Link href={`?page=${meta.currentPage - 1}`}>
                  <Button
                    variant="secondary"
                    className="border-slate-700/50 bg-slate-800/50 text-sm text-slate-300 hover:border-slate-600/50 hover:bg-slate-700/50"
                  >
                    Previous
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-slate-800/50 bg-slate-900/50 text-sm text-slate-600"
                >
                  Previous
                </Button>
              )}
              <span className="px-3 text-sm text-slate-400">
                Page {meta.currentPage} of {meta.totalPages}
              </span>
              {hasNextPage ? (
                <Link href={`?page=${meta.currentPage + 1}`}>
                  <Button
                    variant="secondary"
                    className="border-slate-700/50 bg-slate-800/50 text-sm text-slate-300 hover:border-slate-600/50 hover:bg-slate-700/50"
                  >
                    Next
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-slate-800/50 bg-slate-900/50 text-sm text-slate-600"
                >
                  Next
                </Button>
              )}
              {hasNextPage ? (
                <Link href={`?page=${meta.totalPages}`}>
                  <Button
                    variant="secondary"
                    className="border-slate-700/50 bg-slate-800/50 text-sm text-slate-300 hover:border-slate-600/50 hover:bg-slate-700/50"
                  >
                    Last
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-slate-800/50 bg-slate-900/50 text-sm text-slate-600"
                >
                  Last
                </Button>
              )}
            </div>

            {/* Mobile pagination */}
            <div className="flex items-center gap-2 sm:hidden">
              {hasPreviousPage ? (
                <Link href={`?page=${meta.currentPage - 1}`}>
                  <Button
                    variant="secondary"
                    className="border-slate-700/50 bg-slate-800/50 text-sm text-slate-300 hover:border-slate-600/50 hover:bg-slate-700/50"
                  >
                    Previous
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-slate-800/50 bg-slate-900/50 text-sm text-slate-600"
                >
                  Previous
                </Button>
              )}
              <span className="px-3 text-sm text-slate-400">
                {meta.currentPage}/{meta.totalPages}
              </span>
              {hasNextPage ? (
                <Link href={`?page=${meta.currentPage + 1}`}>
                  <Button
                    variant="secondary"
                    className="border-slate-700/50 bg-slate-800/50 text-sm text-slate-300 hover:border-slate-600/50 hover:bg-slate-700/50"
                  >
                    Next
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-slate-800/50 bg-slate-900/50 text-sm text-slate-600"
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
