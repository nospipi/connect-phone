// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/prices/create-new/DateBasedCheckbox.client.tsx
"use client"

import { useRouter } from "next/navigation"

//------------------------------------------------------------

interface DateBasedCheckboxProps {
  isChecked: boolean
  salesChannelIds?: string
  dateRangeIds?: string
}

export default function DateBasedCheckbox({
  isChecked,
  salesChannelIds,
  dateRangeIds,
}: DateBasedCheckboxProps) {
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const form = e.target.form
    if (!form) return

    const formData = new FormData(form)
    const params = new URLSearchParams()

    const name = formData.get("name") as string
    const amount = formData.get("amount") as string
    const currency = formData.get("currency") as string

    if (name) params.set("name", name)
    if (amount) params.set("amount", amount)
    if (currency) params.set("currency", currency)
    if (salesChannelIds) params.set("salesChannelIds", salesChannelIds)
    if (dateRangeIds) params.set("dateRangeIds", dateRangeIds)

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
