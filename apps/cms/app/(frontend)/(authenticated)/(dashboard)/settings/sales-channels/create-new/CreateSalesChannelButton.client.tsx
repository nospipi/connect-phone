"use client"

import { Button } from "@/components/common/Button"
import { RiAddLine } from "@remixicon/react"
import { useState } from "react"

//--------------------------------------------------------------

const CreateSalesChannelButton = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    setIsLoading(true)
    // Loading state will be reset when the page redirects or if there's an error
  }

  return (
    <Button
      type="submit"
      disabled={isLoading}
      onClick={handleClick}
      className={`relative select-none overflow-hidden ${
        isLoading ? "cursor-not-allowed bg-gray-400" : ""
      }`}
    >
      {isLoading && (
        <div className="absolute inset-0 -skew-x-12 animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      )}
      <RiAddLine className="mr-2 h-4 w-4" />
      {isLoading ? "Creating..." : "Create Sales Channel"}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
      `}</style>
    </Button>
  )
}

export default CreateSalesChannelButton
