// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/offers/[offer_id]/CountrySelectButton.client.tsx

"use client"

import { useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { RiMapPinLine } from "@remixicon/react"
import { PendingOverlay } from "@/components/common/PendingOverlay"

//------------------------------------------------------------

interface CountrySelectButtonProps {
  offerId: string
}

export default function CountrySelectButton({
  offerId,
}: CountrySelectButtonProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    const form = document.querySelector("form") as HTMLFormElement | null
    if (!form) return

    const formData = new FormData(form)
    const urlParams = new URLSearchParams()

    searchParams.forEach((value, key) => {
      urlParams.set(key, value)
    })

    for (const [key, value] of formData.entries()) {
      if (key === "id") continue

      const stringValue = String(value)

      if (stringValue.startsWith("[") && stringValue.endsWith("]")) {
        try {
          const parsed = JSON.parse(stringValue)
          if (Array.isArray(parsed)) {
            urlParams.set(key, parsed.join(","))
            continue
          }
        } catch {}
      }

      urlParams.set(key, stringValue)
    }

    urlParams.set("previousPage", `/inventory/offers/${offerId}`)
    urlParams.set("targetField", "countryIds")
    urlParams.set("multipleSelection", "true")

    const url = `/inventory/countries/select?${urlParams.toString()}`

    startTransition(() => {
      router.push(url)
    })
  }

  return (
    <PendingOverlay mode="custom" onClick={handleClick} isPending={isPending}>
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-800/50"
      >
        <RiMapPinLine className="h-4 w-4" />
        <span>Select countries</span>
      </button>
    </PendingOverlay>
  )
}
