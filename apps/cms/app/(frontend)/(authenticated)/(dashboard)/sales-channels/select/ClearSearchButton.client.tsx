// apps/cms/app/(frontend)/(authenticated)/(dashboard)/sales-channels/select/ClearSearchButton.client.tsx
"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { RiCloseLine, RiLoader4Line } from "@remixicon/react"

//------------------------------------------------------------

interface ClearSearchButtonProps {
  clearUrl: string
}

export default function ClearSearchButton({
  clearUrl,
}: ClearSearchButtonProps) {
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
      type="button"
      className="flex h-11 w-11 flex-shrink-0 items-center justify-center border border-red-200 bg-red-50 text-red-600 shadow-sm transition-colors hover:border-red-300 hover:bg-red-100 disabled:cursor-wait disabled:opacity-75 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:border-red-700/50 dark:hover:bg-red-800/30"
    >
      {isPending ? (
        <RiLoader4Line className="h-5 w-5 animate-spin" />
      ) : (
        <RiCloseLine className="h-5 w-5" />
      )}
    </button>
  )
}
