// apps/cms/app/(frontend)/(authenticated)/(dashboard)/media/select/MediaItemButton.client.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { RiCheckLine, RiLoader4Line } from "@remixicon/react"
import { IMedia } from "@connect-phone/shared-types"

//------------------------------------------------------------

interface MediaItemButtonProps {
  media: IMedia
  isSelected: boolean
  newUrl: string
}

export default function MediaItemButton({
  media,
  isSelected,
  newUrl,
}: MediaItemButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(false)
  }, [isSelected])

  const handleClick = () => {
    setIsLoading(true)
    router.push(newUrl)
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="group relative w-full disabled:cursor-wait"
    >
      <div
        className={`relative aspect-square overflow-hidden rounded-xl transition-all duration-300 ${
          isSelected
            ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-950"
            : "ring-1 ring-gray-200/50 hover:ring-gray-300 dark:ring-gray-800/50 dark:hover:ring-gray-700"
        }`}
      >
        <div className="relative h-full w-full overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          <Image
            src={media.url}
            alt={media.description || "Media"}
            fill
            className="object-cover p-2"
            style={{
              borderRadius: 17,
            }}
          />
        </div>

        <div className="absolute inset-2 rounded-lg bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div
          className={`absolute inset-2 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 transition-opacity duration-300 ${
            isSelected ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="absolute right-3 top-3">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 ${
              isSelected
                ? "scale-100 bg-indigo-600 shadow-lg shadow-indigo-500/50"
                : "scale-90 bg-white/20 opacity-0 group-hover:scale-100 group-hover:opacity-100"
            }`}
          >
            <RiCheckLine
              className={`h-4 w-4 transition-all ${
                isSelected ? "scale-100 text-white" : "scale-75 text-white"
              }`}
            />
          </div>
        </div>

        <div className="absolute bottom-2 left-2 right-2 translate-y-full rounded-lg bg-gradient-to-t from-black/90 to-transparent p-3 transition-transform duration-300 group-hover:translate-y-0">
          <p className="truncate text-xs font-medium text-white">
            {media.description || "No description given"}
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm dark:bg-gray-950/90">
          <RiLoader4Line className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
        </div>
      )}
    </button>
  )
}
