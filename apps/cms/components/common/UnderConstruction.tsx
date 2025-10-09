// apps/cms/components/common/UnderConstruction.tsx
import { RiToolsLine } from "@remixicon/react"

const UnderConstruction = () => {
  return (
    <div className="flex h-full w-full flex-1 items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800/50">
          <RiToolsLine className="h-8 w-8 text-gray-400 dark:text-slate-600" />
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-slate-200">
          Under Construction
        </h3>
        <p className="text-sm text-gray-500 dark:text-slate-500">
          This feature is currently being built
        </p>
      </div>
    </div>
  )
}

export default UnderConstruction
