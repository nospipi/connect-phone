// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/offers/create-new/UnlimitedDataCheckbox.client.tsx
"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { RiLoader4Line } from "@remixicon/react"

//------------------------------------------------------------

interface UnlimitedDataCheckboxProps {
  isChecked: boolean
}

export default function UnlimitedDataCheckbox({
  isChecked,
}: UnlimitedDataCheckboxProps) {
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
        key !== "isUnlimitedData" &&
        key !== "inclusionIds" &&
        key !== "exclusionIds" &&
        key !== "countryIds" &&
        key !== "salesChannelIds" &&
        key !== "priceIds" &&
        key !== "imageIds"
      ) {
        urlParams.set(key, value.toString())
      }
    })

    urlParams.set("isUnlimitedData", newChecked ? "true" : "false")

    if (newChecked) {
      urlParams.delete("dataInGb")
    }

    const inclusionIds = formData.get("inclusionIds")
    if (inclusionIds) {
      const ids = JSON.parse(inclusionIds.toString())
      if (ids.length > 0) {
        urlParams.set("inclusionIds", ids.join(","))
      }
    }

    const exclusionIds = formData.get("exclusionIds")
    if (exclusionIds) {
      const ids = JSON.parse(exclusionIds.toString())
      if (ids.length > 0) {
        urlParams.set("exclusionIds", ids.join(","))
      }
    }

    const countryIds = formData.get("countryIds")
    if (countryIds) {
      const ids = JSON.parse(countryIds.toString())
      if (ids.length > 0) {
        urlParams.set("countryIds", ids.join(","))
      }
    }

    const salesChannelIds = formData.get("salesChannelIds")
    if (salesChannelIds) {
      const ids = JSON.parse(salesChannelIds.toString())
      if (ids.length > 0) {
        urlParams.set("salesChannelIds", ids.join(","))
      }
    }

    const priceIds = formData.get("priceIds")
    if (priceIds) {
      const ids = JSON.parse(priceIds.toString())
      if (ids.length > 0) {
        urlParams.set("priceIds", ids.join(","))
      }
    }

    const imageIds = formData.get("imageIds")
    if (imageIds) {
      const ids = JSON.parse(imageIds.toString())
      if (ids.length > 0) {
        urlParams.set("imageIds", ids.join(","))
      }
    }

    startTransition(() => {
      router.push(`/inventory/offers/create-new?${urlParams.toString()}`)
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
