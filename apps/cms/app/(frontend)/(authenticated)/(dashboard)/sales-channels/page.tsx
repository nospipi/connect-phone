// apps/cms/app/(frontend)/(authenticated)/(dashboard)/sales-channels/page.tsx
import { getAllSalesChannelsOfOrganizationPaginated } from "@/app/(backend)/server_actions/getAllSalesChannelsOfOrganizationPaginated"
import AddChannelButton from "./CreateRandomButton.client"
import SalesChannelItem from "./SalesChannelItem"
import { ISalesChannel } from "@connect-phone/shared-types"
import { Card } from "@/components/common/Card"
import { Button } from "@/components/common/Button"
import Link from "next/link"
import { RiNodeTree } from "@remixicon/react"

//------------------------------------------------------------

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const { page = "1", search = "", role = "all" } = await searchParams

  const salesChannelsResponse =
    await getAllSalesChannelsOfOrganizationPaginated({
      page: page,
    })
  const items: ISalesChannel[] = salesChannelsResponse?.items || []
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

      {items.length === 0 && (
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

      {/* List */}
      {items.length > 0 && (
        <div className="flex-1 overflow-hidden">
          <div className="h-full divide-y divide-gray-200 overflow-auto pr-5 dark:divide-slate-800/30">
            {items.map((channel: ISalesChannel) => (
              <SalesChannelItem key={channel.id} channel={channel} />
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="border-t border-gray-200 pr-5 pt-4 dark:border-slate-800/50">
          <div className="flex items-center justify-center sm:justify-between">
            <div className="hidden items-center gap-4 text-sm text-gray-500 sm:flex dark:text-slate-500">
              <span>
                Showing {(meta.currentPage - 1) * meta.itemsPerPage + 1} to{" "}
                {Math.min(
                  meta.currentPage * meta.itemsPerPage,
                  meta.totalItems,
                )}{" "}
                of {meta.totalItems} users
              </span>
            </div>

            {/* Desktop pagination */}
            <div className="hidden items-center gap-2 sm:flex">
              {hasPreviousPage ? (
                <Link
                  href={`?page=1${search ? `&search=${encodeURIComponent(search)}` : ""}${role !== "all" ? `&role=${role}` : ""}`}
                >
                  <Button
                    variant="secondary"
                    className="border-gray-300 bg-gray-50 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
                  >
                    First
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-gray-200 bg-gray-100 text-sm text-gray-400 dark:border-slate-800/50 dark:bg-slate-900/50 dark:text-slate-600"
                >
                  First
                </Button>
              )}
              {hasPreviousPage ? (
                <Link
                  href={`?page=${meta.currentPage - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}${role !== "all" ? `&role=${role}` : ""}`}
                >
                  <Button
                    variant="secondary"
                    className="border-gray-300 bg-gray-50 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
                  >
                    Previous
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-gray-200 bg-gray-100 text-sm text-gray-400 dark:border-slate-800/50 dark:bg-slate-900/50 dark:text-slate-600"
                >
                  Previous
                </Button>
              )}
              <span className="px-3 text-sm text-gray-600 dark:text-slate-400">
                Page {meta.currentPage} of {meta.totalPages}
              </span>
              {hasNextPage ? (
                <Link
                  href={`?page=${meta.currentPage + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}${role !== "all" ? `&role=${role}` : ""}`}
                >
                  <Button
                    variant="secondary"
                    className="border-gray-300 bg-gray-50 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
                  >
                    Next
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-gray-200 bg-gray-100 text-sm text-gray-400 dark:border-slate-800/50 dark:bg-slate-900/50 dark:text-slate-600"
                >
                  Next
                </Button>
              )}
              {hasNextPage ? (
                <Link
                  href={`?page=${meta.totalPages}${search ? `&search=${encodeURIComponent(search)}` : ""}${role !== "all" ? `&role=${role}` : ""}`}
                >
                  <Button
                    variant="secondary"
                    className="border-gray-300 bg-gray-50 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
                  >
                    Last
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-gray-200 bg-gray-100 text-sm text-gray-400 dark:border-slate-800/50 dark:bg-slate-900/50 dark:text-slate-600"
                >
                  Last
                </Button>
              )}
            </div>

            {/* Mobile pagination */}
            <div className="flex items-center gap-2 sm:hidden">
              {hasPreviousPage ? (
                <Link
                  href={`?page=${meta.currentPage - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}${role !== "all" ? `&role=${role}` : ""}`}
                >
                  <Button
                    variant="secondary"
                    className="border-gray-300 bg-gray-50 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
                  >
                    Previous
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-gray-200 bg-gray-100 text-sm text-gray-400 dark:border-slate-800/50 dark:bg-slate-900/50 dark:text-slate-600"
                >
                  Previous
                </Button>
              )}
              <span className="px-3 text-sm text-gray-600 dark:text-slate-400">
                {meta.currentPage}/{meta.totalPages}
              </span>
              {hasNextPage ? (
                <Link
                  href={`?page=${meta.currentPage + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}${role !== "all" ? `&role=${role}` : ""}`}
                >
                  <Button
                    variant="secondary"
                    className="border-gray-300 bg-gray-50 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
                  >
                    Next
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-gray-200 bg-gray-100 text-sm text-gray-400 dark:border-slate-800/50 dark:bg-slate-900/50 dark:text-slate-600"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Page
