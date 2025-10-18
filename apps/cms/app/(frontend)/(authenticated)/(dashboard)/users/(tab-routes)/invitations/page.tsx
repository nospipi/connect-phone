// apps/cms/app/(frontend)/(authenticated)/(dashboard)/users/(tab-routes)/invitations/page.tsx
import { getAllInvitationsOfOrganizationPaginated } from "@/app/(backend)/server_actions/user-invitations/getAllInvitationsOfOrganizationPaginated"
import { RiUser2Fill } from "@remixicon/react"
import { UserOrganizationRole } from "@connect-phone/shared-types"
import { Pagination } from "@/components/common/pagination/Pagination"
import { PendingOverlay } from "@/components/common/PendingOverlay"
import InvitationItem from "./InvitationItem"

//------------------------------------------------------------

const USER_ROLES = [
  { value: "all", label: "All Roles" },
  ...Object.values(UserOrganizationRole).map((role) => ({
    value: role,
    label: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
  })),
] as const

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const params = await searchParams
  const { page = "1", search = "", role = "all" } = params

  const invitationsResponse = await getAllInvitationsOfOrganizationPaginated({
    page: page,
    search: search,
    role: role,
  })

  const items = invitationsResponse?.items || []
  const meta = invitationsResponse?.meta
  const hasActiveFilters = search !== "" || role !== "all"

  const buildClearSearchUrl = () => {
    const urlParams = new URLSearchParams()
    urlParams.set("page", "1")
    return `/users/invitations?${urlParams.toString()}`
  }

  return (
    <div className="relative flex h-full flex-col gap-3 pt-5">
      {/* HEADER */}
      <div className="flex flex-col gap-3 px-5">
        {/* SEARCH AND FILTER BAR */}
        <form id="search-form" className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search invitations..."
            className="min-w-[200px] flex-1 border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 outline-none focus:border-blue-500 focus:outline-none focus:ring-0 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-slate-700/50"
          />
          <select
            name="role"
            defaultValue={role}
            className="min-w-[140px] flex-1 border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:outline-none focus:ring-0 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:focus:border-slate-700/50"
          >
            {USER_ROLES.map((roleOption) => (
              <option key={roleOption.value} value={roleOption.value}>
                {roleOption.label}
              </option>
            ))}
          </select>
          <PendingOverlay mode="form-navigation" formId="search-form">
            <button
              type="submit"
              form="search-form"
              className="border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 focus:outline-none dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
            >
              Apply
            </button>
          </PendingOverlay>
          {hasActiveFilters && (
            <PendingOverlay mode="navigation" href={buildClearSearchUrl()}>
              <button
                type="button"
                className="border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 hover:border-red-400 hover:bg-red-100 focus:outline-none dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:border-red-600/50 dark:hover:bg-red-800/30"
              >
                Clear
              </button>
            </PendingOverlay>
          )}
        </form>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-auto">
        {items.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800/50">
                <RiUser2Fill className="h-8 w-8 text-gray-400 dark:text-slate-600" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-slate-200">
                No invitations found
              </h3>
              <p className="text-sm text-gray-500 dark:text-slate-500">
                {hasActiveFilters
                  ? "Try adjusting your filters to see more results"
                  : "Invitations will appear here when you invite users to your organization"}
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 px-5 dark:divide-slate-800/30">
            {items.map((invitation: any) => (
              <InvitationItem key={invitation.id} invitation={invitation} />
            ))}
          </div>
        )}
      </div>

      {/* PAGINATION */}
      <Pagination meta={meta} searchParams={params} itemLabel="invitations" />
    </div>
  )
}

export default Page
