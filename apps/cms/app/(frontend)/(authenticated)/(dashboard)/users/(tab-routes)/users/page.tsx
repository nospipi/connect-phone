// apps/cms/app/(frontend)/(authenticated)/(dashboard)/users/(tab-routes)/users/page.tsx
import { Button } from "@/components/common/Button"
import { getAllUsersOfOrganizationPaginated } from "@/app/(backend)/server_actions/organizations/getAllUsersOfOrganizationPaginated"
import Link from "next/link"
import { Badge } from "@/components/common/Badge"
import { RiUser2Fill, RiSearchLine } from "@remixicon/react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/Select"
import { UserOrganizationRole } from "@connect-phone/shared-types"
import { Pagination } from "@/components/common/pagination/Pagination"

//------------------------------------------------------------

const USER_ROLES = [
  { value: "all", label: "All Roles" },
  ...Object.values(UserOrganizationRole).map((role) => ({
    value: role,
    label: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
  })),
] as const

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
  const params = await searchParams
  const { page = "1", search = "", role = "all" } = params

  const usersResponse = await getAllUsersOfOrganizationPaginated({
    page: page,
    search: search,
    role: role,
  })

  const items = usersResponse?.items || []
  const meta = usersResponse?.meta
  const hasActiveFilters = search !== "" || role !== "all"

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      {/* Filters Bar */}
      <div className="my-2 flex flex-col gap-3 px-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <form
            method="GET"
            className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-1 flex-col gap-3 sm:max-w-lg sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:max-w-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <RiSearchLine className="h-4 w-4 text-gray-500 dark:text-slate-500" />
                </div>
                <input
                  autoFocus
                  type="text"
                  name="search"
                  placeholder="Search users..."
                  defaultValue={search}
                  className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 outline-none focus:border-blue-500 focus:outline-none focus:ring-0 focus:ring-transparent dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-slate-700/50"
                />
              </div>

              {/* Role Filter */}
              <div className="w-full sm:w-auto">
                <Select name="role" defaultValue={role}>
                  <SelectTrigger className="border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:focus:border-slate-600 dark:focus:ring-slate-600">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map((roleOption) => (
                      <SelectItem
                        key={roleOption.value}
                        value={roleOption.value}
                      >
                        {roleOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 sm:justify-start">
              <Button
                type="submit"
                variant="secondary"
                className="border-gray-300 bg-gray-50 px-4 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
              >
                Apply
              </Button>
              {hasActiveFilters && (
                <Link href="/users/users">
                  <Button
                    variant="secondary"
                    className="border-red-300 bg-red-50 px-4 text-sm text-red-700 hover:border-red-400 hover:bg-red-100 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:border-red-600/50 dark:hover:bg-red-800/30"
                  >
                    Clear
                  </Button>
                </Link>
              )}
            </div>
          </form>
        </div>
      </div>

      {items.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800/50">
              <RiUser2Fill className="h-8 w-8 text-gray-400 dark:text-slate-600" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-slate-200">
              No users found
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-500">
              {search || role !== "all"
                ? "Try adjusting your filters to see more results"
                : "Users will appear here when they join your organization"}
            </p>
          </div>
        </div>
      )}

      {/* Users List */}
      {items.length > 0 && (
        <div className="flex-1 overflow-hidden">
          <div className="h-full divide-y divide-gray-200 overflow-auto px-3 dark:divide-slate-800/30">
            {items.map((userOrganization: any, index: number) => {
              const user = userOrganization.user
              const role = userOrganization.role
              const initials = getInitials(user.firstName, user.lastName)
              const fullName =
                `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                user.email

              return (
                <Link
                  key={user.id}
                  href={`/users/${user.id}`}
                  className="block"
                >
                  <div className="duration-2000 group py-4 transition-all">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gray-200 to-gray-300 text-sm font-semibold text-gray-700 shadow-sm group-hover:from-gray-300 group-hover:to-gray-400 group-hover:text-gray-800 dark:from-slate-700/60 dark:to-slate-800/60 dark:text-slate-200 dark:group-hover:from-slate-600/60 dark:group-hover:to-slate-700/60 dark:group-hover:text-slate-100">
                          {initials}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900 group-hover:text-gray-700 dark:text-slate-200 dark:group-hover:text-slate-100">
                              {fullName}
                            </p>
                            <p className="truncate text-sm text-gray-600 group-hover:text-gray-500 dark:text-slate-400 dark:group-hover:text-slate-300">
                              {user.email}
                            </p>
                          </div>

                          {/* Role Badge */}
                          <div className="ml-4 flex-shrink-0">
                            <Badge
                              variant={
                                role === UserOrganizationRole.ADMIN
                                  ? "warning"
                                  : "default"
                              }
                            >
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      <Pagination meta={meta} searchParams={params} itemLabel="users" />
    </div>
  )
}

export default Page
