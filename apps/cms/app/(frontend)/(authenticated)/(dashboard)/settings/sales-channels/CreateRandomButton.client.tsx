"use client"
import { createARandomSalesChannel } from "@/app/(backend)/server_actions/createARandomSalesChannel"
import { Button } from "@/components/common/Button"
import { RiAddLine } from "@remixicon/react"
import { useState } from "react"
import { toast } from "react-toastify"

//--------------------------------------------------------------

const AddChannelButton = () => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Button
      disabled={isLoading}
      className={`relative select-none overflow-hidden ${
        isLoading ? "cursor-not-allowed bg-gray-200" : ""
      }`}
      onClick={async () => {
        setIsLoading(true)
        try {
          await createARandomSalesChannel()
          toast.success("Sales channel created successfully!")
        } catch (error) {
          toast.error("Failed to create sales channel.")
        } finally {
          setIsLoading(false)
        }
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 -skew-x-12 animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      )}
      <RiAddLine />
      Add Channel
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

export default AddChannelButton
