import { Button } from "@/components/common/Button"
import { getAllUsersOfOrganizationPaginated } from "@/app/(backend)/server_actions/getAllUsersOfOrganizationPaginated"
import Link from "next/link"
import { Badge } from "@/components/common/Badge"
import { RiUser2Fill } from "@remixicon/react"

//------------------------------------------------------------

// Helper function to generate user initials
const getInitials = (firstName: string, lastName: string): string => {
  const first = firstName?.trim() || ""
  const last = lastName?.trim() || ""

  if (first && last) {
    return (first[0] + last[0]).toUpperCase()
  } else if (first) {
    return first.substring(0, 2).toUpperCase()
  } else if (last) {
    return last.substring(0, 2).toUpperCase()
  }
  return "??"
}

const Page = async ({
  searchParams,
}: {
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
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <div className="bg-slate-900">FILTERS HERE</div>

      {temp_users.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50">
              <RiUser2Fill className="h-8 w-8 text-slate-600" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-slate-200">
              No users found
            </h3>
            <p className="text-sm text-slate-500">
              Users will appear here when they join your organization
            </p>
          </div>
        </div>
      )}

      {/* Users List */}
      {temp_users.length > 0 && (
        <div className="flex-1 overflow-hidden">
          <div className="h-full divide-y divide-slate-800/30 overflow-auto pr-5">
            {temp_users.map((userOrganization: any, index) => {
              const user = userOrganization.user
              const role = userOrganization.role
              const initials = getInitials(user.firstName, user.lastName)
              const fullName =
                `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                user.email

              return (
                <Link
                  key={user.id}
                  href={`/users/users/${user.id}`}
                  className="block"
                >
                  <div className="duration-2000 group py-4 transition-all">
                    <div className="flex items-center space-x-4">
                      {/* Avatar with Initials */}
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-700/60 to-slate-800/60 text-sm font-semibold text-slate-200 shadow-sm group-hover:from-slate-600/60 group-hover:to-slate-700/60 group-hover:text-slate-100">
                          {initials}
                        </div>
                      </div>

                      {/* User Information */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-200 group-hover:text-slate-100">
                              {fullName}
                            </p>
                            <p className="truncate text-sm text-slate-400 group-hover:text-slate-300">
                              {user.email}
                            </p>
                          </div>

                          {/* Role Badge */}
                          <div className="ml-4 flex-shrink-0">
                            <Badge
                              variant={role === "ADMIN" ? "warning" : "default"}
                            >
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Arrow Indicator */}
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-slate-600 transition-all duration-200 group-hover:text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="border-t border-slate-800/50 pr-5 pt-4">
          <div className="flex items-center justify-center sm:justify-between">
            <div className="hidden items-center gap-4 text-sm text-slate-500 sm:flex">
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
