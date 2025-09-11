import { getAllSalesChannelsOfOrganizationPaginated } from "@/app/(backend)/server_actions/getAllSalesChannelsOfOrganizationPaginated"
import { getAllAuditLogsOfOrganizationPaginated } from "@/app/(backend)/server_actions/getAllAuditLogsOfOrganizationPaginated"
import { ISalesChannel, IAuditLog } from "@connect-phone/shared-types"
import { Badge } from "@/components/common/Badge"
import { Card } from "@/components/common/Card"
import { Button } from "@/components/common/Button"
import Link from "next/link"
import {
  RiNodeTree,
  RiExternalLinkLine,
  RiDeleteBin6Line,
  RiEditLine,
} from "@remixicon/react"

//---------------------------------------------------------------------------

const Page = async ({
  //params,
  searchParams,
}: {
  //params: Promise<{ partner_id: string; page: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const { page = "1" } = await searchParams
  console.log("Current page:", page)

  const auditLogsResponse = await getAllAuditLogsOfOrganizationPaginated({
    page: page,
  })
  const auditLogs: IAuditLog[] = auditLogsResponse?.items || []
  const meta = auditLogsResponse?.meta
  const hasPreviousPage = meta?.currentPage > 1
  const hasNextPage = meta?.currentPage < meta?.totalPages

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-7">
      {auditLogs.length === 0 && (
        <Card className="p-8 text-center">
          <RiNodeTree className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-50">
            No audit logs found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Get started by creating your first sales channel
          </p>
        </Card>
      )}

      {/* Sales Channels List */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {auditLogs.map((log: IAuditLog) => (
            <div key={log.id}>LOG</div>
          ))}
        </div>
      </div>

      {/* Pagination Info - Takes only needed space */}
      {meta && meta.totalPages > 1 && (
        <Card className="p-4">
          <div className="flex items-center justify-center sm:justify-between">
            <div className="hidden items-center gap-4 text-sm text-gray-500 sm:flex">
              <span>
                Showing {(meta.currentPage - 1) * meta.itemsPerPage + 1} to{" "}
                {Math.min(
                  meta.currentPage * meta.itemsPerPage,
                  meta.totalItems,
                )}{" "}
                of {meta.totalItems} channels
              </span>
            </div>

            {/* Desktop pagination - shows all buttons */}
            <div className="hidden items-center gap-2 sm:flex">
              {hasPreviousPage ? (
                <Link href={`?page=1`}>
                  <Button variant="secondary" className="text-sm">
                    First
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" disabled className="text-sm">
                  First
                </Button>
              )}
              {hasPreviousPage ? (
                <Link href={`?page=${meta.currentPage - 1}`}>
                  <Button variant="secondary" className="text-sm">
                    Previous
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" disabled className="text-sm">
                  Previous
                </Button>
              )}
              <span className="text-sm text-gray-500">
                Page {meta.currentPage} of {meta.totalPages}
              </span>
              {hasNextPage ? (
                <Link href={`?page=${meta.currentPage + 1}`}>
                  <Button variant="secondary" className="text-sm">
                    Next
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" disabled className="text-sm">
                  Next
                </Button>
              )}
              {hasNextPage ? (
                <Link href={`?page=${meta.totalPages}`}>
                  <Button variant="secondary" className="text-sm">
                    Last
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" disabled className="text-sm">
                  Last
                </Button>
              )}
            </div>

            {/* Mobile pagination - shows only Previous and Next */}
            <div className="flex items-center gap-2 sm:hidden">
              {hasPreviousPage ? (
                <Link href={`?page=${meta.currentPage - 1}`}>
                  <Button variant="secondary" className="text-sm">
                    Previous
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" disabled className="text-sm">
                  Previous
                </Button>
              )}
              <span className="text-sm text-gray-500">
                {meta.currentPage}/{meta.totalPages}
              </span>
              {hasNextPage ? (
                <Link href={`?page=${meta.currentPage + 1}`}>
                  <Button variant="secondary" className="text-sm">
                    Next
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" disabled className="text-sm">
                  Next
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Page
