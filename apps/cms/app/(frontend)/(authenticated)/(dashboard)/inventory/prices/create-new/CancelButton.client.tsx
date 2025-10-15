// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/prices/create-new/CancelButton.client.tsx
"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { RiLoader4Line } from "@remixicon/react"

//------------------------------------------------------------

export default function CancelButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(() => {
      router.push("/inventory/prices")
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-75 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
    >
      {isPending ? (
        <>
          <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />
          <span>Canceling...</span>
        </>
      ) : (
        <span>Cancel</span>
      )}
    </button>
  )
}
