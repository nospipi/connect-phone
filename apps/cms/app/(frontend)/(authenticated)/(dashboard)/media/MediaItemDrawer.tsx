// apps/cms/app/(frontend)/(authenticated)/(dashboard)/media/MediaItemDrawer.tsx
import { updateMedia } from "@/app/(backend)/server_actions/media/updateMedia"
import { deleteMediaById } from "@/app/(backend)/server_actions/media/deleteMediaById"
import Image from "next/image"
import Link from "next/link"
import { RiExternalLinkLine } from "@remixicon/react"
import { IMedia } from "@connect-phone/shared-types"

//------------------------------------------------------------

interface MediaItemDrawerProps {
  media: IMedia
  currentPage: string
  currentSearch: string
}

const MediaItemDrawer = ({
  media,
  currentPage,
  currentSearch,
}: MediaItemDrawerProps) => {
  const closeUrl = `/media?page=${currentPage}${currentSearch ? `&search=${currentSearch}` : ""}`

  return (
    <>
      <input
        type="checkbox"
        id={`media-drawer-${media.id}`}
        className="peer hidden"
        defaultChecked
      />

      <label
        htmlFor={`media-drawer-${media.id}`}
        className="invisible fixed inset-0 z-40 bg-black/50 opacity-0 backdrop-blur-sm transition-all duration-300 peer-checked:visible peer-checked:opacity-100"
      />

      <div className="absolute bottom-0 left-0 right-0 z-50 translate-y-full transform border-t border-gray-200 bg-white transition-transform duration-300 ease-out peer-checked:translate-y-0 dark:border-gray-800 dark:bg-gray-950">
        <div className="container mx-auto max-w-5xl px-4 py-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Edit Media
              </h3>
            </div>
            <Link
              href={closeUrl}
              className="rounded-full p-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
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
            </Link>
          </div>

          <div className="mb-6">
            <div className="mb-4 flex items-start gap-4">
              <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <Image
                  src={media.url}
                  alt={media.description || "Media"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <a
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <RiExternalLinkLine className="h-3 w-3" />
                  View full image
                </a>
              </div>
            </div>

            <form action={updateMedia} className="space-y-4">
              <input type="hidden" name="id" value={media.id} />
              <input type="hidden" name="returnUrl" value={closeUrl} />

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  defaultValue={media.description || ""}
                  placeholder="Add a description for this media..."
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
                <Link
                  href={closeUrl}
                  className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-indigo-700"
                >
                  Update Media
                </button>
              </div>
            </form>

            <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-800">
              <h4 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
                Danger Zone
              </h4>
              <form action={deleteMediaById}>
                <input type="hidden" name="id" value={media.id} />
                <input type="hidden" name="returnUrl" value={closeUrl} />
                <button
                  type="submit"
                  className="rounded-md bg-red-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-700"
                >
                  Delete Media
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MediaItemDrawer
