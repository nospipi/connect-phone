// apps/cms/app/(frontend)/(authenticated)/(dashboard)/users/invite-user/page.tsx

import { createUserInvitation } from "@/app/(backend)/server_actions/user-invitations/createUserInvitation"
import { RiArrowLeftLine, RiMailSendLine } from "@remixicon/react"
import Link from "next/link"
import { UserOrganizationRole } from "@connect-phone/shared-types"
import { PendingOverlay } from "@/components/common/PendingOverlay"

//------------------------------------------------------------

const USER_ROLES = [
  ...Object.values(UserOrganizationRole).map((role) => ({
    value: role,
    label: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
  })),
] as const

const Page = async () => {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center gap-4 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <Link
          href="/users/invitations"
          className="flex h-full items-center justify-center px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-300"
        >
          <RiArrowLeftLine className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-4 py-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Invite User
            </h1>
            <p className="text-sm text-gray-500">
              Send an invitation to join your organization
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden py-4">
        <div className="flex h-full w-full justify-center overflow-auto px-4">
          <div className="w-full max-w-3xl">
            <form action={createUserInvitation} className="flex flex-col gap-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  autoFocus
                  id="email"
                  name="email"
                  type="email"
                  placeholder="e.g., user@example.com"
                  className="mt-2 block w-full border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm outline-none focus:border-indigo-500 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  required
                />
                <p className="mt-2 text-xs text-gray-500">
                  Enter the email address of the user you want to invite
                </p>
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="mt-2 block w-full border border-gray-300 bg-white px-3 py-2 shadow-sm outline-none focus:border-indigo-500 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                >
                  {USER_ROLES.map((roleOption) => (
                    <option key={roleOption.value} value={roleOption.value}>
                      {roleOption.label}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs text-gray-500">
                  Select the role to assign to the invited user
                </p>
              </div>

              <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end dark:border-gray-800">
                <PendingOverlay mode="navigation" href="/users/invitations">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </PendingOverlay>
                <PendingOverlay mode="form">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                  >
                    <RiMailSendLine className="mr-2 h-4 w-4" />
                    Send Invitation
                  </button>
                </PendingOverlay>
              </div>
            </form>

            <div className="mt-6 bg-blue-50 p-4 dark:bg-blue-900/20">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                What happens when I invite a user?
              </h3>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-200">
                When you invite a user, they will receive an email invitation to
                join your organization. Once they accept the invitation, they
                will be able to access the platform and the resources you have
                shared with them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
