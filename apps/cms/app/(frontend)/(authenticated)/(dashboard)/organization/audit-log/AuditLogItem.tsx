import { IAuditLog } from "@connect-phone/shared-types"
import { Badge } from "@/components/common/Badge"
import { RiTimeLine, RiUser3Line, RiEyeLine } from "@remixicon/react"
import { formatDistanceToNow } from "date-fns"
import DataComparison from "./DataComparison"

//---------------------------------------------------------------------------------

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp)
  return formatDistanceToNow(date, { addSuffix: true })
}

const getOperationBadgeVariant = (operation: string) => {
  switch (operation.toLowerCase()) {
    case "insert":
      return "success"
    case "update":
      return "warning"
    case "delete":
      return "error"
    default:
      return "neutral"
  }
}

export const AuditLogItem = ({ log }: { log: IAuditLog }) => {
  const hasDataToShow =
    (log.before && Object.keys(log.before).length > 0) ||
    (log.after && Object.keys(log.after).length > 0)

  const expanderId = `audit-log-expander-${log.id}`

  return (
    <div className="border-b border-slate-800/50 px-1 pb-4 pt-6 last:border-b-0">
      {/* Hidden checkbox to control expansion state */}
      <input type="checkbox" id={expanderId} className="peer hidden" />

      {/* Main content */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          {/* Entity info */}
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Badge variant={getOperationBadgeVariant(log.operation)}>
              {log.operation}
            </Badge>

            <span className="text-slate-600">•</span>
            <span className="font-mono text-xs text-slate-500">
              {log.table_name}
            </span>
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <RiTimeLine className="h-3 w-3 text-slate-600" />
              <span>{formatTimestamp(log.created_at.toString())}</span>
            </div>

            {log.user && (
              <div className="flex items-center gap-1.5">
                <RiUser3Line className="h-3 w-3 text-slate-600" />
                <span>
                  by {log.user.firstName} {log.user.lastName}
                </span>
              </div>
            )}

            {hasDataToShow && (
              <label
                htmlFor={expanderId}
                className="flex cursor-pointer select-none items-center gap-1.5 text-slate-500 hover:text-slate-400"
              >
                <RiEyeLine className="h-3 w-3" />
                <span>Show changes</span>
              </label>
            )}
          </div>
        </div>

        {/* ID badge */}
        <div className="flex-shrink-0">
          <div className="text-right">
            <div className="font-mono text-xs text-slate-600">#{log.id}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 hidden pt-4 peer-checked:block">
        <DataComparison before={log.before} after={log.after} />
      </div>
    </div>
  )
}
