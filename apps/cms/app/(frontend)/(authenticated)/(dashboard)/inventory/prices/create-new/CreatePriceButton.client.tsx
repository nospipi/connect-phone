// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/prices/create-new/CreatePriceButton.client.tsx
"use client"

import { useFormStatus } from "react-dom"
import { RiAddLine, RiLoader4Line } from "@remixicon/react"

//------------------------------------------------------------

export default function CreatePriceButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-75"
    >
      {pending ? (
        <>
          <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />
          <span>Creating...</span>
        </>
      ) : (
        <>
          <RiAddLine className="mr-2 h-4 w-4" />
          <span>Create Price</span>
        </>
      )}
    </button>
  )
}
