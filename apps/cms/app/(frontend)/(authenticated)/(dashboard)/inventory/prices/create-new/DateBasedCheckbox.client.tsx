// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/prices/create-new/DateBasedCheckbox.client.tsx
"use client"

import { useRouter } from "next/navigation"

//------------------------------------------------------------

interface DateBasedCheckboxProps {
  isChecked: boolean
}

export default function DateBasedCheckbox({
  isChecked,
}: DateBasedCheckboxProps) {
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const form = document.querySelector("form") as HTMLFormElement
    if (!form) return

    const formData = new FormData(form)
    const urlParams = new URLSearchParams()

    // Preserve all form values
    formData.forEach((value, key) => {
      if (
        key !== "isDateBased" &&
        key !== "salesChannelIds" &&
        key !== "dateRangeIds"
      ) {
        urlParams.set(key, value.toString())
      }
    })

    // Set the new checkbox value
    urlParams.set("isDateBased", e.target.checked ? "true" : "false")

    // Preserve selections
    const salesChannelIds = formData.get("salesChannelIds")
    if (salesChannelIds) {
      const ids = JSON.parse(salesChannelIds.toString())
      if (ids.length > 0) {
        urlParams.set("salesChannelIds", ids.join(","))
      }
    }

    const dateRangeIds = formData.get("dateRangeIds")
    if (dateRangeIds) {
      const ids = JSON.parse(dateRangeIds.toString())
      if (ids.length > 0) {
        urlParams.set("dateRangeIds", ids.join(","))
      }
    }

    router.push(`/inventory/prices/create-new?${urlParams.toString()}`)
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
