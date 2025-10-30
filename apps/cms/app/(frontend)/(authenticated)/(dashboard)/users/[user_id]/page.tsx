// apps/cms/app/(frontend)/(authenticated)/(dashboard)/users/[user_id]/page.tsx

import { RiArrowLeftLine } from "@remixicon/react"
import Link from "next/link"
import { UserOrganizationRole } from "@connect-phone/shared-types"
import { getUserById } from "@/app/(backend)/server_actions/users/getUserById"
import { updateUser } from "@/app/(backend)/server_actions/users/updateUser"
import DeleteUserButton from "./DeleteUserButton"
import { PendingOverlay } from "@/components/common/PendingOverlay"

//------------------------------------------------------------

const USER_ROLES = [
  ...Object.values(UserOrganizationRole).map((role) => ({
    value: role,
    label: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
  })),
] as const

const Page = async ({ params }: { params: Promise<{ user_id: string }> }) => {
  const { user_id } = await params
  const userData = await getUserById(Number(user_id))

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div className="flex items-center gap-4 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <Link
          href="/users/users"
          className="flex h-full items-center justify-center px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-300"
        >
          <RiArrowLeftLine className="h-4 w-4" />
        </Link>
        <div className="flex flex-1 items-center justify-between gap-4 py-4 pr-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Edit User
            </h1>
            <p className="text-sm text-gray-500">
              Update the user&apos;s information
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden py-4">
        <div className="flex h-full w-full justify-center overflow-auto px-4">
          <div className="flex w-full max-w-3xl flex-col">
            <form action={updateUser} className="flex flex-1 flex-col gap-6">
              <input type="hidden" name="id" value={userData.id} />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    First Name
                  </label>
                  <input
                    defaultValue={userData.firstName}
                    autoFocus
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="e.g., John"
                    className="mt-2 block w-full border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm outline-none focus:border-indigo-500 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Last Name
                  </label>
                  <input
                    defaultValue={userData.lastName}
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="e.g., Doe"
                    className="mt-2 block w-full border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm outline-none focus:border-indigo-500 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  defaultValue={userData.email}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="e.g., user@example.com"
                  className="mt-2 block w-full border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm outline-none focus:border-indigo-500 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  required
                />
                <p className="mt-2 text-xs text-gray-500">
                  Update the user&apos;s email address
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
                  defaultValue={userData.role}
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
                  Update the user&apos;s role
                </p>
              </div>

              <div className="flex flex-row justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-800">
                <div className="flex gap-3">
                  <PendingOverlay mode="navigation" href="/users/users">
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
                      Update User
                    </button>
                  </PendingOverlay>
                </div>
              </div>
            </form>
            <DeleteUserButton user={userData} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
