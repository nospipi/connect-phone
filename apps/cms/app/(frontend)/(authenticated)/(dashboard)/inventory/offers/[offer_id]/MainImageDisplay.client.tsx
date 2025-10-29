// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/offers/[offer_id]/MainImageDisplay.client.tsx

"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { RiCloseLine } from "@remixicon/react"
import { PendingOverlay } from "@/components/common/PendingOverlay"

//------------------------------------------------------------

interface MainImageDisplayProps {
  imageUrl: string
  imageAlt: string
  removeUrl: string
}

export default function MainImageDisplay({
  imageUrl,
  imageAlt,
  removeUrl,
}: MainImageDisplayProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleRemove = () => {
    startTransition(() => {
      router.push(removeUrl)
    })
  }

  return (
    <div className="relative inline-block">
      <PendingOverlay
        mode="custom"
        onClick={handleRemove}
        isPending={isPending}
      >
        <div
          className="relative h-48 w-48 overflow-hidden rounded-lg border border-gray-300 dark:border-slate-700/50"
          title={imageAlt}
        >
          <Image src={imageUrl} alt={imageAlt} fill className="object-cover" />
        </div>
      </PendingOverlay>
      <button
        type="button"
        onClick={handleRemove}
        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700"
      >
        <RiCloseLine className="h-4 w-4" />
      </button>
    </div>
  )
}
