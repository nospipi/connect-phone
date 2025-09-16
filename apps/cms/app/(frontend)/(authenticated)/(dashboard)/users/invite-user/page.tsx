import { RiArrowLeftLine } from "@remixicon/react"
import Link from "next/link"

//----------------------------------------------------------------------

const Page = async () => {
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
              Invite User
            </h1>
            <p className="text-sm text-gray-500">
              Send an invitation to join your organization
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
