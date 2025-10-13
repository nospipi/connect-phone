// apps/cms/app/(frontend)/(authenticated)/(dashboard)/media/MediaItemButton.tsx
import Image from "next/image"
import { IMedia } from "@connect-phone/shared-types"

//------------------------------------------------------------

const MediaItem = ({ media }: { media: IMedia }) => {
  return (
    <label
      htmlFor={`media-drawer-${media.id}`}
      className="group relative cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl ring-1 ring-gray-200/50 transition-all duration-300 hover:ring-gray-300 dark:ring-gray-800/50 dark:hover:ring-gray-700">
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

        <div className="absolute bottom-2 left-2 right-2 translate-y-full rounded-lg bg-gradient-to-t from-black/90 to-transparent p-3 transition-transform duration-300 group-hover:translate-y-0">
          <p className="truncate text-xs font-medium text-white">
            {media.description || "No description"}
          </p>
        </div>
      </div>
    </label>
  )
}

export default MediaItem
