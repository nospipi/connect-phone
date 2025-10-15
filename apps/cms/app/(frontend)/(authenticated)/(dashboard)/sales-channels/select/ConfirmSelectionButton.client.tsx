// apps/cms/app/(frontend)/(authenticated)/(dashboard)/sales-channels/select/ConfirmSelectionButton.client.tsx
"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { RiLoader4Line } from "@remixicon/react"

//------------------------------------------------------------

interface ConfirmSelectionButtonProps {
  confirmUrl: string
}

export default function ConfirmSelectionButton({
  confirmUrl,
}: ConfirmSelectionButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(() => {
      router.push(confirmUrl)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="relative overflow-hidden whitespace-nowrap rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 disabled:cursor-wait disabled:opacity-75"
    >
      {isPending ? (
        <span className="flex items-center gap-2">
          <RiLoader4Line className="h-4 w-4 animate-spin" />
          <span className="relative">Processing...</span>
        </span>
      ) : (
        <span className="relative">Confirm Selection</span>
      )}
    </button>
  )
}
