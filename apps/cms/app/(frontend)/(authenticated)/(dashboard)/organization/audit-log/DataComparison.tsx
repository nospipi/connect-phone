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
            <div className="col-span-3 font-mono text-slate-500">{key}</div>

            {/* Before value */}
            <div className="col-span-4">
              {before === null ? (
                <span className="italic text-slate-600">—</span>
              ) : (
                <span
                  className={`${hasChanged ? "text-red-400" : "text-slate-400"}`}
                >
                  {beforeValue === null
                    ? "null"
                    : beforeValue?.toString() || "—"}
                </span>
              )}
            </div>

            {/* Arrow or indicator */}
            <div className="col-span-1 flex justify-center">
              {hasChanged && <span className="text-slate-600">→</span>}
            </div>

            {/* After value */}
            <div className="col-span-4">
              {after === null ? (
                <span className="italic text-slate-600">—</span>
              ) : (
                <span
                  className={`${hasChanged ? "text-green-400" : "text-slate-400"}`}
                >
                  {afterValue === null ? "null" : afterValue?.toString() || "—"}
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
