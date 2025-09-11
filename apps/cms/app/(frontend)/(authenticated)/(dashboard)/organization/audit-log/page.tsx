import { getAllAuditLogsOfOrganizationPaginated } from "@/app/(backend)/server_actions/getAllAuditLogsOfOrganizationPaginated"
import { IAuditLog } from "@connect-phone/shared-types"
import { Card } from "@/components/common/Card"
import { Button } from "@/components/common/Button"
import { Badge } from "@/components/common/Badge"
import Link from "next/link"
import { RiNodeTree, RiUser3Line, RiTimeLine } from "@remixicon/react"

//---------------------------------------------------------------------------

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 1) {
    return "Just now"
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`
  } else {
    return date.toLocaleDateString()
  }
}

const getOperationBadgeColor = (operation: string) => {
  switch (operation.toLowerCase()) {
    case "insert":
    case "create":
      return "border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900 dark:text-green-100"
    case "update":
    case "modify":
      return "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100"
    case "delete":
    case "remove":
      return "border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900 dark:text-red-100"
    default:
      return "border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
  }
}

const getActionDescription = (log: IAuditLog) => {
  const tableName = log.table_name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
  const operation = log.operation.toLowerCase()

  switch (operation) {
    case "insert":
      return `Created new ${tableName.slice(0, -1)}`
    case "update":
      return `Updated ${tableName.slice(0, -1)}`
    case "delete":
      return `Deleted ${tableName.slice(0, -1)}`
    default:
      return `${log.operation} on ${tableName}`
  }
}

const getEntityName = (log: IAuditLog) => {
  if (log.after && typeof log.after === "object") {
    return (
      log.after.name ||
      log.after.title ||
      log.after.email ||
      `ID: ${log.row_id}`
    )
  }
  if (log.before && typeof log.before === "object") {
    return (
      log.before.name ||
      log.before.title ||
      log.before.email ||
      `ID: ${log.row_id}`
    )
  }
  return `ID: ${log.row_id}`
}

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
    <div className="flex h-full flex-col gap-4 overflow-hidden">
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

      {/* Audit Logs List */}
      <div className="flex-1 overflow-auto">
        <div className="space-y-3">
          {auditLogs.map((log: IAuditLog) => (
            <Card
              key={log.id}
              className="p-4 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <Badge
                      className={`text-xs font-medium ${getOperationBadgeColor(log.operation)}`}
                    >
                      {log.operation}
                    </Badge>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {getActionDescription(log)}
                    </span>
                  </div>

                  <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{getEntityName(log)}</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-xs">{log.table_name}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <RiTimeLine className="h-3 w-3" />
                      <span>{formatTimestamp(log.created_at.toString())}</span>
                    </div>

                    {log.user && (
                      <div className="flex items-center gap-1">
                        <RiUser3Line className="h-3 w-3" />
                        <span>
                          by {log.user.firstName} {log.user.lastName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <div className="text-right text-xs text-gray-400">
                    #{log.id}
                  </div>
                </div>
              </div>

              {/* Changes Preview */}
              {log.after && typeof log.after === "object" && (
                <div className="mt-3 border-t border-gray-100 pt-3 dark:border-gray-800">
                  <div className="mb-1 text-xs text-gray-500">Changes:</div>
                  <div className="rounded bg-gray-50 px-2 py-1 font-mono text-xs dark:bg-gray-900">
                    {Object.entries(log.after)
                      .filter(
                        ([key]) =>
                          !["id", "createdAt", "updatedAt"].includes(key),
                      )
                      .slice(0, 3)
                      .map(([key, value]) => (
                        <div key={key} className="truncate">
                          <span className="text-gray-600 dark:text-gray-400">
                            {key}:
                          </span>{" "}
                          <span className="text-gray-900 dark:text-gray-100">
                            {typeof value === "string"
                              ? value
                              : JSON.stringify(value)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </Card>
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
                of {meta.totalItems} logs
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
