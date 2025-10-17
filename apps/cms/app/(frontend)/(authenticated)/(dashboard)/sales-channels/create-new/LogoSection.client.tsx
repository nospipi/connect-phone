// apps/cms/app/(frontend)/(authenticated)/(dashboard)/sales-channels/create-new/LogoSection.client.tsx
"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { RiImageLine, RiDeleteBinLine } from "@remixicon/react"
import { IMedia } from "@connect-phone/shared-types"
import MediaSelectButton from "./MediaSelectButton.client"
import { PendingOverlay } from "@/components/common/PendingOverlay"
import { useTransition } from "react"

//------------------------------------------------------------

interface LogoSectionProps {
  selectedLogo: IMedia | null
  logoId: number | null
}

export default function LogoSection({
  selectedLogo,
  logoId,
}: LogoSectionProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleRemove = () => {
    const form = document.querySelector("form") as HTMLFormElement
    if (!form) return

    const formData = new FormData(form)
    const urlParams = new URLSearchParams()

    formData.forEach((value, key) => {
      if (key !== "logoId") {
        urlParams.set(key, value.toString())
      }
    })

    urlParams.set("logoId", "")

    startTransition(() => {
      router.push(`/sales-channels/create-new?${urlParams.toString()}`)
    })
  }

  return (
    <div className="mt-2">
      {selectedLogo ? (
        <div className="overflow-hidden border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-4 p-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden border border-gray-200 bg-gray-50 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <Image
                src={selectedLogo.url}
                alt={selectedLogo.description || "Sales channel logo"}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 self-stretch">
              <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                {selectedLogo.description || "Sales channel logo"}
              </p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Current logo
              </p>
            </div>
            <div className="flex h-full flex-shrink-0 gap-2 self-stretch">
              <div className="flex h-full">
                <MediaSelectButton
                  previousPage="/sales-channels/create-new"
                  targetField="logoId"
                  multipleSelection={false}
                  currentLogoId={logoId}
                />
              </div>
              <PendingOverlay
                mode="custom"
                onClick={handleRemove}
                isPending={isPending}
              >
                <button
                  type="button"
                  className="flex h-full min-w-[60px] items-center justify-center border border-gray-200 bg-white px-3 text-gray-400 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500 dark:hover:border-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                  title="Remove logo"
                >
                  <RiDeleteBinLine className="h-4 w-4" />
                </button>
              </PendingOverlay>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-4 p-4">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center border border-gray-200 bg-gray-50 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <RiImageLine className="h-7 w-7 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                No logo selected
              </p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Choose an image from your media library
              </p>
            </div>
            <div className="flex h-full flex-shrink-0 self-stretch">
              <div className="flex h-full">
                <MediaSelectButton
                  previousPage="/sales-channels/create-new"
                  targetField="logoId"
                  multipleSelection={false}
                  currentLogoId={logoId}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
