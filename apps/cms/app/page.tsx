import { UserButton } from "@clerk/nextjs"
import Link from "next/link"

//----------------------------------------------------------------------

const Page = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <span>HOME</span>
      <div className="absolute left-4 top-4 flex max-w-xs flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Link href="/tests-page">
            <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Visit the tests page
            </button>
          </Link>
        </div>
      </div>
      <div className="absolute right-4 top-4">
        <UserButton />
      </div>
    </div>
  )
}

export default Page
