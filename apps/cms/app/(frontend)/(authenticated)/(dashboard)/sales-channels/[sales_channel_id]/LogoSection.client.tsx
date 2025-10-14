// apps/cms/app/(frontend)/(authenticated)/(dashboard)/sales-channels/[sales_channel_id]/LogoSection.client.tsx
"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { RiImageLine, RiDeleteBinLine } from "@remixicon/react"
import { IMedia } from "@connect-phone/shared-types"
import MediaSelectButton from "./MediaSelectButton.client"

//----------------------------------------------------------------------

interface LogoSectionProps {
  selectedLogo: IMedia | null
  logoId: number | null
  salesChannelId: string
}

export default function LogoSection({
  selectedLogo,
  logoId,
  salesChannelId,
}: LogoSectionProps) {
  const router = useRouter()

  const handleRemove = () => {
    const form = document.querySelector("form") as HTMLFormElement
    if (!form) return

    const formData = new FormData(form)
    const urlParams = new URLSearchParams()

    formData.forEach((value, key) => {
      if (key !== "id" && key !== "logoId") {
        urlParams.set(key, value.toString())
      }
    })

    urlParams.set("logoId", "")

    router.push(`/sales-channels/${salesChannelId}?${urlParams.toString()}`)
  }

  return (
    <div className="mt-2">
      {selectedLogo ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-4 p-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <Image
                src={selectedLogo.url}
                alt={selectedLogo.description || "Sales channel logo"}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {selectedLogo.description || "Sales channel logo"}
              </p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Current logo
              </p>
            </div>
            <div className="flex flex-shrink-0 gap-2">
              <MediaSelectButton
                previousPage={`/sales-channels/${salesChannelId}`}
                targetField="logoId"
                multipleSelection={false}
                currentLogoId={logoId}
                salesChannelId={salesChannelId}
              />
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white p-2 text-gray-400 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500 dark:hover:border-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                title="Remove logo"
              >
                <RiDeleteBinLine className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/50 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md dark:border-gray-700 dark:from-gray-800 dark:to-gray-800/50 dark:hover:border-indigo-800">
          <div className="flex items-center gap-4 p-6">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
              <RiImageLine className="h-7 w-7 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                No logo selected
              </p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Choose an image from your media library
              </p>
            </div>
            <div className="flex-shrink-0">
              <MediaSelectButton
                previousPage={`/sales-channels/${salesChannelId}`}
                targetField="logoId"
                multipleSelection={false}
                currentLogoId={logoId}
                salesChannelId={salesChannelId}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
