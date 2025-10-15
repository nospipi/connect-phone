// apps/cms/app/(frontend)/(authenticated)/(dashboard)/media/select/MediaGrid.client.tsx
"use client"

import { useState } from "react"
import { IMedia } from "@connect-phone/shared-types"
import MediaItemButton from "./MediaItemButton.client"

//------------------------------------------------------------

interface MediaGridProps {
  items: IMedia[]
  selectedIds: number[]
  multipleSelection: boolean
  page: string
  search: string
  previousPage: string
  targetField: string
  formData: Record<string, string>
}

export default function MediaGrid({
  items,
  selectedIds,
  multipleSelection,
  page,
  search,
  previousPage,
  targetField,
  formData,
}: MediaGridProps) {
  const [isAnyLoading, setIsAnyLoading] = useState(false)

  const buildUrl = (newSelectedIds: number[]) => {
    const urlParams = new URLSearchParams()
    urlParams.set("previousPage", previousPage)
    urlParams.set("targetField", targetField)
    urlParams.set("multipleSelection", String(multipleSelection))
    Object.entries(formData).forEach(([key, value]) => {
      urlParams.set(key, value)
    })
    urlParams.set("page", page)
    if (search) urlParams.set("search", search)
    urlParams.set("selected", newSelectedIds.join(","))
    return `/media/select?${urlParams.toString()}`
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
      {items.map((media) => {
        const isSelected = selectedIds.includes(media.id)

        const newSelectedIds = multipleSelection
          ? isSelected
            ? selectedIds.filter((id) => id !== media.id)
            : [...selectedIds, media.id]
          : isSelected
            ? []
            : [media.id]

        return (
          <MediaItemButton
            key={media.id}
            media={media}
            isSelected={isSelected}
            newUrl={buildUrl(newSelectedIds)}
            isAnyLoading={isAnyLoading}
            onLoadingChange={setIsAnyLoading}
          />
        )
      })}
    </div>
  )
}