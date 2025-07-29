"use client"

import { useState } from "react"
import { RiRefreshLine } from "@remixicon/react"
import { useRouter } from "next/navigation"

const RevalidateButton = () => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  const handleRevalidate = async () => {
    setIsRefreshing(true)

    try {
      router.refresh()
      // Add a small delay to make the loading state visible
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error("Error revalidating:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <button
      onClick={handleRevalidate}
      className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
      title="Refresh user data"
      disabled={isRefreshing}
    >
      <RiRefreshLine
        size={18}
        className={isRefreshing ? "animate-spin text-blue-500" : ""}
      />
    </button>
  )
}

export default RevalidateButton
