// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/offers/[offer_id]/SelectedItemBadge.client.tsx

"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { RiCloseLine } from "@remixicon/react"
import { Badge } from "@/components/common/Badge"
import { PendingOverlay } from "@/components/common/PendingOverlay"

//------------------------------------------------------------

interface SelectedItemBadgeProps {
  id: number
  label: string
  removeUrl: string
}

export default function SelectedItemBadge({
  id,
  label,
  removeUrl,
}: SelectedItemBadgeProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleRemove = () => {
    startTransition(() => {
      router.push(removeUrl)
    })
  }

  return (
    <PendingOverlay mode="custom" onClick={handleRemove} isPending={isPending}>
      <Badge variant="neutral" className="group relative cursor-pointer">
        <span>{label}</span>
        <RiCloseLine className="ml-1 h-3 w-3 group-hover:text-red-600" />
      </Badge>
    </PendingOverlay>
  )
}
