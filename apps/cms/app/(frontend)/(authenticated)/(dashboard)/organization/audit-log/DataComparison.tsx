import { format, isValid, parseISO } from "date-fns"

const DataComparison = ({
  before,
  after,
}: {
  before: Record<string, any> | null
  after: Record<string, any> | null
}) => {
  // Get all unique keys from both objects
  const allKeys = new Set([
    ...(before ? Object.keys(before) : []),
    ...(after ? Object.keys(after) : []),
  ])

  const formatValue = (value: any) => {
    if (value === null) return "null"
    if (value === undefined) return "undefined"

    // Handle Date objects
    if (value instanceof Date && isValid(value)) {
      return format(value, "dd-MM-yyyy HH:mm:ss")
    }

    // Handle date strings (ISO format, etc.)
    if (typeof value === "string") {
      // Try to parse as date first
      try {
        const parsedDate = parseISO(value)
        if (isValid(parsedDate)) {
          return format(parsedDate, "dd-MM-yyyy HH:mm")
        }
      } catch {
        // Not a date string, continue with regular string handling
      }
      return String(value)
    }

    if (typeof value === "number") {
      return String(value)
    }

    return JSON.stringify(value)
  }

  const compareValues = (key: string) => {
    const beforeValue = before?.[key]
    const afterValue = after?.[key]
    const hasChanged = beforeValue !== afterValue

    return { beforeValue, afterValue, hasChanged }
  }

  return (
    <div className="space-y-3">
      {Array.from(allKeys).map((key) => {
        const { beforeValue, afterValue, hasChanged } = compareValues(key)

        return (
          <div key={key} className="grid grid-cols-12 gap-3 text-xs">
            {/* Field name */}
            <div className="col-span-3 overflow-hidden break-words font-mono text-slate-500">
              {key}
            </div>

            {/* Before value */}
            <div className="col-span-4 min-w-0">
              {before === null ? (
                <span className="italic text-slate-600">...</span>
              ) : (
                <span
                  className={`${
                    hasChanged ? "text-red-400" : "text-slate-400"
                  } overflow-wrap-anywhere whitespace-pre-wrap break-all`}
                >
                  {formatValue(beforeValue) || "..."}
                </span>
              )}
            </div>

            {/* Arrow or indicator */}
            <div className="col-span-1 flex items-start justify-center pt-1">
              {hasChanged && <span className="text-slate-600">→</span>}
            </div>

            {/* After value */}
            <div className="col-span-4 min-w-0">
              {after === null ? (
                <span className="italic text-slate-600">...</span>
              ) : (
                <span
                  className={`${
                    hasChanged ? "text-green-400" : "text-slate-400"
                  } overflow-wrap-anywhere whitespace-pre-wrap break-all`}
                >
                  {formatValue(afterValue) || "..."}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DataComparison
