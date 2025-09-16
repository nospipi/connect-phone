import { Button } from "@/components/common/Button"
import { getAllUsersOfOrganizationPaginated } from "@/app/(backend)/server_actions/getAllUsersOfOrganizationPaginated"
//import { ModalAddUser } from "@/components/ui/settings/ModalAddUser"
import Link from "next/link"
import { RiUser2Fill } from "@remixicon/react"

//------------------------------------------------------------

const Page = async ({
  //params,
  searchParams,
}: {
  //params: Promise<{ partner_id: string; page: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const { page = "1" } = await searchParams
  console.log("Current page:", page)

  const usersResponse = await getAllUsersOfOrganizationPaginated({
    page: page,
  })
  const temp_users = usersResponse?.items || []
  const meta = usersResponse?.meta
  const hasPreviousPage = meta?.currentPage > 1
  const hasNextPage = meta?.currentPage < meta?.totalPages

  return (
    <div className="flex h-full flex-col gap-6 overflow-hidden">
      {temp_users.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50">
              <RiUser2Fill className="h-8 w-8 text-slate-600" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-slate-200">
              No audit logs found
            </h3>
            <p className="text-sm text-slate-500">
              Activity logs will appear here as changes are made to your
              organization
            </p>
          </div>
        </div>
      )}

      {/* TEMPORARY IMPLEMENTATION */}
      {temp_users.length > 0 && (
        <div className="min-h-0 flex-1 overflow-auto">
          <div className="relative">
            {/* Main content */}
            <div className="relative space-y-0">
              {temp_users.map((user: any, index) => (
                <div key={index}>{user.user.firstName}</div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="border-t border-slate-800/50 pt-4">
          <div className="flex items-center justify-center sm:justify-between">
            <div className="hidden items-center gap-4 text-sm text-slate-500 sm:flex">
              <span>
                Showing {(meta.currentPage - 1) * meta.itemsPerPage + 1} to{" "}
                {Math.min(
                  meta.currentPage * meta.itemsPerPage,
                  meta.totalItems,
                )}{" "}
                of {meta.totalItems} logs
              </span>
            </div>

            {/* Desktop pagination */}
            <div className="hidden items-center gap-2 sm:flex">
              {hasPreviousPage ? (
                <Link href={`?page=1`}>
                  <Button
                    variant="secondary"
                    className="border-slate-700/50 bg-slate-800/50 text-sm text-slate-300 hover:border-slate-600/50 hover:bg-slate-700/50"
                  >
                    First
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-slate-800/50 bg-slate-900/50 text-sm text-slate-600"
                >
                  First
                </Button>
              )}
              {hasPreviousPage ? (
                <Link href={`?page=${meta.currentPage - 1}`}>
                  <Button
                    variant="secondary"
                    className="border-slate-700/50 bg-slate-800/50 text-sm text-slate-300 hover:border-slate-600/50 hover:bg-slate-700/50"
                  >
                    Previous
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-slate-800/50 bg-slate-900/50 text-sm text-slate-600"
                >
                  Previous
                </Button>
              )}
              <span className="px-3 text-sm text-slate-400">
                Page {meta.currentPage} of {meta.totalPages}
              </span>
              {hasNextPage ? (
                <Link href={`?page=${meta.currentPage + 1}`}>
                  <Button
                    variant="secondary"
                    className="border-slate-700/50 bg-slate-800/50 text-sm text-slate-300 hover:border-slate-600/50 hover:bg-slate-700/50"
                  >
                    Next
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-slate-800/50 bg-slate-900/50 text-sm text-slate-600"
                >
                  Next
                </Button>
              )}
              {hasNextPage ? (
                <Link href={`?page=${meta.totalPages}`}>
                  <Button
                    variant="secondary"
                    className="border-slate-700/50 bg-slate-800/50 text-sm text-slate-300 hover:border-slate-600/50 hover:bg-slate-700/50"
                  >
                    Last
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-slate-800/50 bg-slate-900/50 text-sm text-slate-600"
                >
                  Last
                </Button>
              )}
            </div>

            {/* Mobile pagination */}
            <div className="flex items-center gap-2 sm:hidden">
              {hasPreviousPage ? (
                <Link href={`?page=${meta.currentPage - 1}`}>
                  <Button
                    variant="secondary"
                    className="border-slate-700/50 bg-slate-800/50 text-sm text-slate-300 hover:border-slate-600/50 hover:bg-slate-700/50"
                  >
                    Previous
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-slate-800/50 bg-slate-900/50 text-sm text-slate-600"
                >
                  Previous
                </Button>
              )}
              <span className="px-3 text-sm text-slate-400">
                {meta.currentPage}/{meta.totalPages}
              </span>
              {hasNextPage ? (
                <Link href={`?page=${meta.currentPage + 1}`}>
                  <Button
                    variant="secondary"
                    className="border-slate-700/50 bg-slate-800/50 text-sm text-slate-300 hover:border-slate-600/50 hover:bg-slate-700/50"
                  >
                    Next
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="secondary"
                  disabled
                  className="border-slate-800/50 bg-slate-900/50 text-sm text-slate-600"
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
