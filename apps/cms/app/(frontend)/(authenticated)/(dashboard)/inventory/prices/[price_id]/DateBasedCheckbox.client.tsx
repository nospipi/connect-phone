// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/prices/[price_id]/DateBasedCheckbox.client.tsx

"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { RiLoader4Line } from "@remixicon/react"

//------------------------------------------------------------

interface DateBasedCheckboxProps {
  isChecked: boolean
  priceId: string
}

export default function DateBasedCheckbox({
  isChecked,
  priceId,
}: DateBasedCheckboxProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isCheckedState, setIsCheckedState] = useState(isChecked)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked
    setIsCheckedState(newChecked)

    const form = document.querySelector("form") as HTMLFormElement
    if (!form) return

    const formData = new FormData(form)
    const urlParams = new URLSearchParams()

    formData.forEach((value, key) => {
      if (
        key !== "id" &&
        key !== "isDateBased" &&
        key !== "salesChannelIds" &&
        key !== "dateRangeIds"
      ) {
        urlParams.set(key, value.toString())
      }
    })

    urlParams.set("isDateBased", newChecked ? "true" : "false")

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

    startTransition(() => {
      router.push(`/inventory/prices/${priceId}?${urlParams.toString()}`)
    })
  }

  return (
    <div className="relative inline-flex items-center">
      <input
        type="checkbox"
        checked={isCheckedState}
        onChange={handleChange}
        disabled={isPending}
        className="h-5 w-5 cursor-pointer rounded border-gray-300 text-indigo-600 transition-all hover:border-indigo-400 hover:shadow-md focus:ring-2 focus:ring-indigo-500 disabled:cursor-wait disabled:opacity-50 dark:border-slate-700/50 dark:bg-slate-900/50 dark:hover:border-indigo-500/50"
      />
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center">
          <RiLoader4Line className="h-5 w-5 animate-spin text-indigo-600 dark:text-indigo-400" />
        </div>
      )}
    </div>
  )
}
