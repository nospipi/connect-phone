// apps/cms/app/(frontend)/(authenticated)/(dashboard)/sales-channels/select/ClearSelectionButton.client.tsx
"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { RiCloseLine, RiLoader4Line } from "@remixicon/react"

//------------------------------------------------------------

interface ClearSelectionButtonProps {
  clearUrl: string
}

export default function ClearSelectionButton({
  clearUrl,
}: ClearSelectionButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(() => {
      router.push(clearUrl)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="relative inline-flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm disabled:cursor-wait disabled:opacity-75 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
    >
      {isPending ? (
        <RiLoader4Line className="h-4 w-4 animate-spin" />
      ) : (
        <RiCloseLine className="h-4 w-4" />
      )}
      <span className="relative">
        {isPending ? "Clearing..." : "Clear Selection"}
      </span>
    </button>
  )
}
