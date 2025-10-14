// apps/cms/app/(frontend)/(authenticated)/(dashboard)/media/select/SearchForm.tsx
import { RiSearchLine } from "@remixicon/react"

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
  return (
    <form method="GET" action="/media/select" className="w-full max-w-2xl">
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

      {/* Preserve all form data */}
      {Object.entries(formData).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}

      <div className="relative">
        <RiSearchLine className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          name="search"
          defaultValue={currentSearch}
          placeholder="Search by description..."
          className="w-full rounded-xl border border-gray-200/50 bg-white/80 py-3 pl-12 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-sm backdrop-blur-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-800/50 dark:bg-gray-900/80 dark:text-white dark:placeholder-gray-500"
        />
      </div>
    </form>
  )
}
