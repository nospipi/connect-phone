// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/prices/create-new/DateRangeSelectButton.client.tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"

//------------------------------------------------------------

export default function DateRangeSelectButton() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleClick = () => {
    const form = document.querySelector("form") as HTMLFormElement | null
    if (!form) return

    const formData = new FormData(form)
    const urlParams = new URLSearchParams()

    // Add all existing URL params first
    searchParams.forEach((value, key) => {
      urlParams.set(key, value)
    })

    // Add/override with form fields
    for (const [key, value] of formData.entries()) {
      const stringValue = String(value)

      // Detect JSON array format and convert to comma-separated string
      if (stringValue.startsWith("[") && stringValue.endsWith("]")) {
        try {
          const parsed = JSON.parse(stringValue)
          if (Array.isArray(parsed)) {
            urlParams.set(key, parsed.join(","))
            continue
          }
        } catch {
          // If parsing fails, use as-is
        }
      }

      urlParams.set(key, stringValue)
    }

    // Add or override custom URL params
    urlParams.set("previousPage", "/inventory/prices/create-new")
    urlParams.set("targetField", "dateRangeIds")
    urlParams.set("multipleSelection", "true")

    // Build final URL
    const url = `/inventory/calendar/select?${urlParams.toString()}`
    router.push(url)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-800/50"
    >
      Select date ranges
    </button>
  )
}
