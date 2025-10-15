// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/prices/create-new/SalesChannelSelectButton.client.tsx
"use client"

import { useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { RiNodeTree, RiLoader4Line } from "@remixicon/react"

//------------------------------------------------------------

export default function SalesChannelSelectButton() {
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
      const stringValue = String(value)

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

    urlParams.set("previousPage", "/inventory/prices/create-new")
    urlParams.set("targetField", "salesChannelIds")
    urlParams.set("multipleSelection", "true")

    const url = `/sales-channels/select?${urlParams.toString()}`

    startTransition(() => {
      router.push(url)
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-800/50"
    >
      {isPending ? (
        <>
          <RiLoader4Line className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          <RiNodeTree className="h-4 w-4" />
          <span>Select sales channels</span>
        </>
      )}
    </button>
  )
}
