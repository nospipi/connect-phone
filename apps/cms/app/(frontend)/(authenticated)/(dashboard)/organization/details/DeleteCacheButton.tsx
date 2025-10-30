// apps/cms/app/(frontend)/(authenticated)/(dashboard)/organization/details/DeleteCacheButton.tsx

"use client"

import { deleteAllCache } from "@/app/(backend)/server_actions/organizations/deleteAllCache"
import { RiRefreshLine } from "@remixicon/react"
import { PendingOverlay } from "@/components/common/PendingOverlay"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

//------------------------------------------------------------

const DeleteCacheButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        await deleteAllCache()
        setIsOpen(false)
        router.refresh()
      } catch (error) {
        console.error("Failed to delete cache:", error)
      }
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="absolute bottom-5 left-5 z-10 flex cursor-pointer items-center gap-2 border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:border-red-400 hover:bg-red-100 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:border-red-600/50 dark:hover:bg-red-800/30"
      >
        <RiRefreshLine className="h-4 w-4" />
        Clear Cache
      </button>

      <div
        onClick={() => setIsOpen(false)}
        className={`absolute inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-300 ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      <div
        className={`absolute bottom-0 left-0 right-0 z-50 w-full transform border-t border-gray-200 bg-white transition-transform duration-300 ease-out dark:border-gray-800 dark:bg-gray-950 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="container mx-auto max-w-5xl px-4 py-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Clear Organization Cache
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="cursor-pointer p-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg
                className="h-5 w-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <p className="mb-2 text-gray-700 dark:text-gray-300">
              Are you sure you want to clear all cached data for this
              organization?
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              This will force fresh data to be loaded on the next request.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="cursor-pointer bg-gray-200 px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>

            <PendingOverlay
              mode="custom"
              onClick={handleSubmit}
              isPending={isPending}
            >
              <button
                disabled={isPending}
                type="button"
                className="bg-red-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-700 disabled:opacity-50"
              >
                Clear Cache
              </button>
            </PendingOverlay>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeleteCacheButton
