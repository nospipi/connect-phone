"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { RiArrowDropLeftLine } from "@remixicon/react"

//------------------------------------------------------------------------------

const BackButton = () => {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <button
      onClick={() => router.back()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsPressed(false)
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={`group relative flex items-center gap-1 rounded-full px-4 py-2 font-medium transition-all duration-300 ${
        isPressed
          ? "translate-y-0.5 bg-indigo-700 shadow-none"
          : isHovered
            ? "translate-y-0 bg-indigo-600 shadow-lg"
            : "bg-indigo-500 shadow-md hover:bg-indigo-600"
      } overflow-hidden`}
    >
      <div
        className={`absolute inset-0 rounded-full bg-white opacity-0 transition-opacity duration-300 ease-out ${isPressed ? "opacity-10" : ""} `}
      />

      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20" />

      <div
        className={`text-2xl text-white transition-transform duration-300 ${isHovered ? "-translate-x-1" : ""} `}
      >
        <RiArrowDropLeftLine />
      </div>

      <span className="text-xs font-semibold text-white">Back</span>

      <div
        className={`z-5 absolute -inset-full block h-full w-1/4 transform bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 ease-in-out ${isHovered ? "left-full -translate-x-full" : "-translate-x-full"} `}
      />
    </button>
  )
}

export default BackButton
