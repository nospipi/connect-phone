// apps/cms/app/(frontend)/(authenticated)/(dashboard)/sales-channels/[sales_channel_id]/MediaSelectButton.client.tsx
"use client"

import { useRouter } from "next/navigation"
import { RiImageLine } from "@remixicon/react"

//----------------------------------------------------------------------

interface MediaSelectButtonProps {
  previousPage: string
  targetField: string
  multipleSelection: boolean
  currentLogoId?: number | null
  salesChannelId: string
}

export default function MediaSelectButton({
  previousPage,
  targetField,
  multipleSelection,
  currentLogoId,
  salesChannelId,
}: MediaSelectButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    const form = document.querySelector("form") as HTMLFormElement
    if (!form) return

    const formData = new FormData(form)
    const urlParams = new URLSearchParams()

    urlParams.set("previousPage", previousPage)
    urlParams.set("targetField", targetField)
    urlParams.set("multipleSelection", String(multipleSelection))

    if (currentLogoId) {
      urlParams.set("selected", currentLogoId.toString())
    }

    formData.forEach((value, key) => {
      if (key !== "id") {
        urlParams.set(key, value.toString())
      }
    })

    router.push(`/media/select?${urlParams.toString()}`)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
    >
      <RiImageLine className="h-4 w-4" />
      {currentLogoId ? "Change" : "Select Logo"}
    </button>
  )
}
