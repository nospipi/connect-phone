// apps/cms/app/(frontend)/(authenticated)/(dashboard)/sales-channels/page.tsx
import { getAllSalesChannelsOfOrganizationPaginated } from "@/app/(backend)/server_actions/getAllSalesChannelsOfOrganizationPaginated"
import AddChannelButton from "./CreateRandomButton.client"
import SalesChannelItem from "./SalesChannelItem"
import { ISalesChannel } from "@connect-phone/shared-types"
import { Card } from "@/components/common/Card"
import { Button } from "@/components/common/Button"
import Link from "next/link"
import { RiNodeTree } from "@remixicon/react"

//---------------------------------------------------------------------------

const Page = async ({
  //params,
  searchParams,
}: {
  //params: Promise<{ partner_id: string; page: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const { page = "1" } = await searchParams

  const salesChannelsResponse =
    await getAllSalesChannelsOfOrganizationPaginated({
      page: page,
    })
  const salesChannels: ISalesChannel[] = salesChannelsResponse?.items || []
  const meta = salesChannelsResponse?.meta
  const hasPreviousPage = meta?.currentPage > 1
  const hasNextPage = meta?.currentPage < meta?.totalPages

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-7">
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
            <SalesChannelItem key={channel.id} channel={channel} />
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
                <Link href={`?page=1`}>
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
                <Link href={`?page=${meta.currentPage - 1}`}>
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
                <Link href={`?page=${meta.currentPage + 1}`}>
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
                <Link href={`?page=${meta.totalPages}`}>
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
                <Link href={`?page=${meta.currentPage - 1}`}>
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
                <Link href={`?page=${meta.currentPage + 1}`}>
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
