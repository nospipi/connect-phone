// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/prices/create-new/DateBasedCheckbox.client.tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"

//------------------------------------------------------------

interface DateBasedCheckboxProps {
  isChecked: boolean
}

export default function DateBasedCheckbox({
  isChecked,
}: DateBasedCheckboxProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("isDateBased", e.target.checked ? "true" : "false")
    router.push(`/inventory/prices/create-new?${params.toString()}`)
  }

  return (
    <input
      type="checkbox"
      checked={isChecked}
      onChange={handleChange}
      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 dark:border-slate-700/50 dark:bg-slate-900/50"
    />
  )
}
