import { createUserInvitation } from "@/app/(backend)/server_actions/createUserInvitation"
import { RiArrowLeftLine } from "@remixicon/react"
import Link from "next/link"

//----------------------------------------------------------------------

const fetchMockUserData = async (userId: string) => {
  // Simulate an API call delay
  await new Promise((resolve) => setTimeout(resolve, 3000))
  // Return mock user data
  return {
    id: userId,
    email: "test@example.com",
    role: "ADMIN",
  }
}

const mockUpdateUser = async (formData: FormData): Promise<void> => {
  "use server"
  // Simulate an API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))
  // Log form data for demonstration purposes
  console.log("Form Data Submitted:")
  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`)
  })
  //we navigate back to the users list page
}

const Page = async ({ params }: { params: Promise<{ user_id: string }> }) => {
  const { user_id } = await params
  const userData = await fetchMockUserData(user_id)

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <Link
          href="/users/users"
          className="flex h-full items-center justify-center px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-300"
        >
          <RiArrowLeftLine className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-4 py-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Edit User
            </h1>
            <p className="text-sm text-gray-500">
              Update the user&#39;s information
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-hidden py-4">
        <div className="flex h-full w-full justify-center overflow-auto px-4">
          <div className="w-full max-w-3xl">
            <form action={mockUpdateUser} className="flex flex-col gap-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  defaultValue={userData.email}
                  autoFocus
                  id="email"
                  name="email"
                  type="email"
                  placeholder="e.g., user@example.com"
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  required
                />
                <p className="mt-2 text-xs text-gray-500">
                  Enter the email address of the user you want to invite
                </p>
              </div>

              {/* Role */}
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
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="OPERATOR">Operator</option>
                  <option value="ADMIN">Admin</option>
                </select>

                <p className="mt-2 text-xs text-gray-500">
                  Select the role to assign to the invited user
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end dark:border-gray-800">
                <Link
                  href="/users/invitations"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
