import { getAllSalesChannelsOfOrganizationPaginated } from "@/app/(backend)/server_actions/getAllSalesChannelsOfOrganizationPaginated"
import AddChannelButton from "../CreateRandomButton.client"
import { ISalesChannel } from "@connect-phone/shared-types"
import { Badge } from "@/components/common/Badge"
import { Card } from "@/components/common/Card"
import { Button } from "@/components/common/Button"
import Link from "next/link"
import {
  RiNodeTree,
  RiExternalLinkLine,
  RiDeleteBin6Line,
  RiEditLine,
} from "@remixicon/react"

//---------------------------------------------------------------------------

const Page = async ({
  params,
  //searchParams,
}: {
  params: Promise<{ partner_id: string; page: string }>
  //searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const { page } = await params

  const salesChannelsResponse =
    await getAllSalesChannelsOfOrganizationPaginated({
      page: page,
    })
  const salesChannels: ISalesChannel[] = salesChannelsResponse?.items || []
  const meta = salesChannelsResponse?.meta
  const hasPreviousPage = meta?.currentPage > 1
  const hasNextPage = meta?.currentPage < meta?.totalPages

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-4">
      {/* Header Section */}
      <div className="flex flex-shrink-0 items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
            Sales Channels
          </h1>
          <p className="mt-1 hidden text-sm text-gray-500 sm:flex">
            Manage your organization&apos;s sales channels and distribution
            networks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sales-channels/create-new">
            <AddChannelButton />
          </Link>
        </div>
      </div>

      {salesChannels.length === 0 && (
        <Card className="p-8 text-center">
          <RiNodeTree className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-50">
            No sales channels found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Get started by creating your first sales channel
          </p>
        </Card>
      )}

      {/* Sales Channels List */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {salesChannels.map((channel: ISalesChannel) => (
            <Card
              key={channel.name}
              className="flex flex-col p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-50">
                    {channel.name}
                  </h3>
                  <Badge className="shrink-0 border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900 dark:text-green-100">
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

      {/* Pagination Info - Takes only needed space */}
      {meta && meta.totalPages > 1 && (
        <Card className="p-4">
          <div className="flex items-center justify-center sm:justify-between">
            <div className="hidden items-center gap-4 text-sm text-gray-500 sm:flex">
              <span>
                Showing {(meta.currentPage - 1) * meta.itemsPerPage + 1} to{" "}
                {Math.min(
                  meta.currentPage * meta.itemsPerPage,
                  meta.totalItems,
                )}{" "}
                of {meta.totalItems} channels
              </span>
            </div>

            {/* Desktop pagination - shows all buttons */}
            <div className="hidden items-center gap-2 sm:flex">
              {hasPreviousPage ? (
                <Link href={`/sales-channels/1`}>
                  <Button variant="secondary" className="text-sm">
                    First
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" disabled className="text-sm">
                  First
                </Button>
              )}
              {hasPreviousPage ? (
                <Link href={`/sales-channels/${meta.currentPage - 1}`}>
                  <Button variant="secondary" className="text-sm">
                    Previous
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" disabled className="text-sm">
                  Previous
                </Button>
              )}
              <span className="text-sm text-gray-500">
                Page {meta.currentPage} of {meta.totalPages}
              </span>
              {hasNextPage ? (
                <Link href={`/sales-channels/${meta.currentPage + 1}`}>
                  <Button variant="secondary" className="text-sm">
                    Next
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" disabled className="text-sm">
                  Next
                </Button>
              )}
              {hasNextPage ? (
                <Link href={`/sales-channels/${meta.totalPages}`}>
                  <Button variant="secondary" className="text-sm">
                    Last
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" disabled className="text-sm">
                  Last
                </Button>
              )}
            </div>

            {/* Mobile pagination - shows only Previous and Next */}
            <div className="flex items-center gap-2 sm:hidden">
              {hasPreviousPage ? (
                <Link href={`/sales-channels/${meta.currentPage - 1}`}>
                  <Button variant="secondary" className="text-sm">
                    Previous
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" disabled className="text-sm">
                  Previous
                </Button>
              )}
              <span className="text-sm text-gray-500">
                {meta.currentPage}/{meta.totalPages}
              </span>
              {hasNextPage ? (
                <Link href={`/sales-channels/${meta.currentPage + 1}`}>
                  <Button variant="secondary" className="text-sm">
                    Next
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" disabled className="text-sm">
                  Next
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Page
