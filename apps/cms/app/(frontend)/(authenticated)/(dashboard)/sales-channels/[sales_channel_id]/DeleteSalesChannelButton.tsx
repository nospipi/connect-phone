// apps/cms/app/(frontend)/(authenticated)/(dashboard)/sales-channels/[sales_channel_id]/DeleteSalesChannelButton.tsx
import { RiDeleteBin6Line } from "@remixicon/react"
import { deleteSalesChannelById } from "@/app/(backend)/server_actions/sales-channels/deleteSalesChannelById"
import { ISalesChannel } from "@connect-phone/shared-types"

//----------------------------------------------------------------------

const DeleteSalesChannelButton = ({
  salesChannel,
}: {
  salesChannel: ISalesChannel
}) => {
  return (
    <>
      {/* Hidden checkbox to control drawer state */}
      <input
        type="checkbox"
        id={`delete-sales-channel-${salesChannel.id}`}
        className="peer hidden"
      />

      <label
        htmlFor={`delete-sales-channel-${salesChannel.id}`}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
      >
        <RiDeleteBin6Line className="h-4 w-4" />
      </label>

      {/* Backdrop Overlay */}
      <label
        htmlFor={`delete-sales-channel-${salesChannel.id}`}
        className="invisible fixed inset-0 z-40 bg-black/50 opacity-0 backdrop-blur-sm transition-all duration-300 peer-checked:visible peer-checked:opacity-100"
      />

      {/* Delete Confirmation Drawer */}
      <div className="absolute bottom-0 left-0 right-0 z-50 translate-y-full transform border-t border-gray-200 bg-white transition-transform duration-300 ease-out peer-checked:translate-y-0 dark:border-gray-800 dark:bg-gray-950">
        <div className="container mx-auto max-w-5xl px-4 py-6">
          {/* Drawer Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Delete Sales Channel
              </h3>
            </div>
            {/* Close Drawer Button */}
            <label
              htmlFor={`delete-sales-channel-${salesChannel.id}`}
              className="cursor-pointer rounded-full p-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
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
            </label>
          </div>

          {/* Confirmation Content */}
          <div className="mb-6">
            <p className="mb-2 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete the sales channel:
            </p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {salesChannel.name}
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              This action cannot be undone
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <label
              htmlFor={`delete-sales-channel-${salesChannel.id}`}
              className="cursor-pointer rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </label>
            <form action={deleteSalesChannelById}>
              <input
                type="hidden"
                name="salesChannelId"
                value={salesChannel.id}
              />
              <button
                type="submit"
                className="rounded-md bg-red-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-700"
              >
                Delete Sales Channel
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeleteSalesChannelButton
