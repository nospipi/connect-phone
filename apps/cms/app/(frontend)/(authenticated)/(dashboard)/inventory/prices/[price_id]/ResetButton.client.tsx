// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/prices/[price_id]/ResetButton.client.tsx
"use client"

import { RiRefreshLine } from "@remixicon/react"
import { PendingOverlay } from "@/components/common/PendingOverlay"

//------------------------------------------------------------

interface ResetButtonProps {
  priceId: string
}

export default function ResetButton({ priceId }: ResetButtonProps) {
  return (
    <PendingOverlay mode="navigation" href={`/inventory/prices/${priceId}`}>
      <button
        type="button"
        className="inline-flex items-center justify-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
      >
        <RiRefreshLine className="mr-2 h-4 w-4" />
        <span>Reset</span>
      </button>
    </PendingOverlay>
  )
}
