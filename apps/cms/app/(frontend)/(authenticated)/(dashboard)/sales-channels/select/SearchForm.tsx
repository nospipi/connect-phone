// apps/cms/app/(frontend)/(authenticated)/(dashboard)/sales-channels/select/SearchForm.tsx
import { RiSearchLine, RiCloseLine } from "@remixicon/react"
import Link from "next/link"

//----------------------------------------------------------------------

interface SearchFormProps {
  currentSearch: string
  previousPage: string
  selectedParam: string
  formData: Record<string, string>
  targetField: string
  multipleSelection: boolean
}

export default function SearchForm({
  currentSearch,
  previousPage,
  selectedParam,
  formData,
  targetField,
  multipleSelection,
}: SearchFormProps) {
  const buildClearUrl = () => {
    const urlParams = new URLSearchParams()
    urlParams.set("previousPage", previousPage)
    urlParams.set("targetField", targetField)
    urlParams.set("multipleSelection", String(multipleSelection))
    urlParams.set("page", "1")
    if (selectedParam) urlParams.set("selected", selectedParam)
    Object.entries(formData).forEach(([key, value]) => {
      urlParams.set(key, value)
    })
    return `/sales-channels/select?${urlParams.toString()}`
  }

  return (
    <div className="flex w-full items-center gap-2">
      <form method="GET" action="/sales-channels/select" className="flex-1">
        <input type="hidden" name="page" value="1" />
        <input type="hidden" name="previousPage" value={previousPage} />
        <input type="hidden" name="targetField" value={targetField} />
        <input
          type="hidden"
          name="multipleSelection"
          value={String(multipleSelection)}
        />
        {selectedParam && (
          <input type="hidden" name="selected" value={selectedParam} />
        )}

        {Object.entries(formData).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}

        <div className="relative">
          <RiSearchLine className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="search"
            defaultValue={currentSearch}
            placeholder="Search by name..."
            className="w-full rounded-xl border border-gray-200/50 bg-white/80 py-3 pl-12 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-sm backdrop-blur-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-800/50 dark:bg-gray-900/80 dark:text-white dark:placeholder-gray-500"
          />
        </div>
      </form>

      {currentSearch && (
        <Link href={buildClearUrl()}>
          <button
            type="button"
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 shadow-sm transition-colors hover:border-red-300 hover:bg-red-100 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:border-red-700/50 dark:hover:bg-red-800/30"
          >
            <RiCloseLine className="h-5 w-5" />
          </button>
        </Link>
      )}
    </div>
  )
}
