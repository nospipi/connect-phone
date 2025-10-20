// apps/cms/app/(frontend)/(authenticated)/(dashboard)/sales-channels/select/SelectAllCheckbox.client.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  RiCheckboxBlankLine,
  RiCheckboxIndeterminateLine,
  RiLoader4Line,
} from "@remixicon/react"

//------------------------------------------------------------

interface SelectAllCheckboxProps {
  items: { id: number }[]
  selectedIds: number[]
  multipleSelection: boolean
  page: string
  search: string
  previousPage: string
  targetField: string
  formData: Record<string, string>
}

export default function SelectAllCheckbox({
  items,
  selectedIds,
  multipleSelection,
  page,
  search,
  previousPage,
  targetField,
  formData,
}: SelectAllCheckboxProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const currentPageIds = items.map((item) => item.id)
  const allCurrentPageSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedIds.includes(id))
  const anyCurrentPageSelected = currentPageIds.some((id) =>
    selectedIds.includes(id),
  )

  useEffect(() => {
    setIsLoading(false)
  }, [selectedIds])

  const buildUrl = (newSelectedIds: number[]) => {
    const urlParams = new URLSearchParams()
    urlParams.set("previousPage", previousPage)
    urlParams.set("targetField", targetField)
    urlParams.set("multipleSelection", String(multipleSelection))
    Object.entries(formData).forEach(([key, value]) => {
      urlParams.set(key, value)
    })
    urlParams.set("page", page)
    if (search) urlParams.set("search", search)
    urlParams.set("salesChannelIds", newSelectedIds.join(","))
    return `/sales-channels/select?${urlParams.toString()}`
  }

  const handleClick = () => {
    if (!multipleSelection || isLoading) return

    setIsLoading(true)

    const newSelectedIds = allCurrentPageSelected
      ? selectedIds.filter((id) => !currentPageIds.includes(id))
      : Array.from(new Set([...selectedIds, ...currentPageIds]))

    const url = buildUrl(newSelectedIds)
    router.push(url)
  }

  if (!multipleSelection) return null

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="flex items-center gap-2 border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:cursor-wait disabled:opacity-60 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-800/50"
    >
      {isLoading ? (
        <RiLoader4Line className="h-4 w-4 animate-spin" />
      ) : anyCurrentPageSelected ? (
        <RiCheckboxIndeterminateLine className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
      ) : (
        <RiCheckboxBlankLine className="h-4 w-4" />
      )}
      <span className="whitespace-nowrap">Select All</span>
    </button>
  )
}
