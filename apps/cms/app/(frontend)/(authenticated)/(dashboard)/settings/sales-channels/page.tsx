import { columns } from "@/components/ui/data-table/columns"
import { DataTable } from "@/components/ui/data-table/DataTable"
import { usage } from "@/data/data"
import { getAllSalesChannelsOfOrganizationPaginated } from "@/app/(backend)/server_actions/getAllSalesChannelsOfOrganizationPaginated"
import AddChannelButton from "./CreateRandomButton.client"
import { SalesChannel } from "@connect-phone/shared-types"
import { Badge } from "@/components/common/Badge"
import { Card } from "@/components/common/Card"
import { Button } from "@/components/common/Button"
import {
  RiNodeTree,
  RiAddLine,
  RiExternalLinkLine,
  RiDeleteBin6Line,
  RiEditLine,
} from "@remixicon/react"

// export interface SalesChannel {
//   id: number
//   uuid: string
//   name: string
//   description: string | null
// }

const Page = async () => {
  // console.log("Fetching sales channels...")

  const salesChannelsResponse =
    await getAllSalesChannelsOfOrganizationPaginated({
      organizationId: 31, // Replace with actual organization ID
      page: 1,
      limit: 10,
    })

  // Extract the items from the paginated response
  const salesChannels = salesChannelsResponse.items || []
  const meta = salesChannelsResponse.meta

  return (
    <div className="flex h-screen flex-col p-4 sm:px-6 sm:pb-10 sm:pt-10 lg:px-10 lg:pt-7">
      {/* Header Section - Fixed */}
      <div className="flex shrink-0 items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
            Sales Channels
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your organization&apos;s sales channels and distribution
            networks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AddChannelButton />
        </div>
      </div>

      {/* Sales Channels List - Scrollable */}
      <div className="mt-8 flex-1 overflow-hidden">
        {salesChannels.length === 0 ? (
          <Card className="p-8 text-center">
            <RiNodeTree className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-50">
              No sales channels found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Get started by creating your first sales channel
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <AddChannelButton />
              <Button className="flex items-center gap-2">
                <RiAddLine className="h-4 w-4" />
                Add New Channel
              </Button>
            </div>
          </Card>
        ) : (
          <div className="flex h-full flex-col">
            {/* Sales Channels Grid - Scrollable Content */}
            <div className="flex-1 overflow-auto">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {salesChannels.map((channel) => (
                  <Card
                    key={channel.uuid}
                    className="p-6 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-50">
                            {channel.name}
                          </h3>
                          <Badge variant="default" className="shrink-0">
                            Active
                          </Badge>
                        </div>

                        {channel.description ? (
                          <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                            {channel.description}
                          </p>
                        ) : (
                          <p className="mt-2 text-sm italic text-gray-400">
                            No description provided
                          </p>
                        )}

                        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                          <span>ID: {channel.id}</span>
                          <span className="truncate">
                            UUID: {channel.uuid.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
                      <div className="flex gap-2">
                        <Button variant="ghost" className="p-2">
                          <RiEditLine className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" className="p-2">
                          <RiExternalLinkLine className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        <RiDeleteBin6Line className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Pagination Info - Fixed at bottom */}
            {meta && meta.totalPages > 1 && (
              <div className="mt-4 shrink-0">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        Showing {(meta.currentPage - 1) * meta.itemsPerPage + 1}{" "}
                        to{" "}
                        {Math.min(
                          meta.currentPage * meta.itemsPerPage,
                          meta.totalItems,
                        )}{" "}
                        of {meta.totalItems} channels
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        disabled={!meta.hasPreviousPage}
                        className="text-sm"
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-500">
                        Page {meta.currentPage} of {meta.totalPages}
                      </span>
                      <Button
                        variant="secondary"
                        disabled={!meta.hasNextPage}
                        className="text-sm"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
