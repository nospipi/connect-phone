import { UserButton } from "@clerk/nextjs"
import { createBlankUser, isLoggedUserInDb } from "@/app/server_actions"

//----------------------------------------------------------------------

const Page = async () => {
  const loggedUserInDb = await isLoggedUserInDb()

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="flex max-w-xs flex-col gap-4">
        <h5 className="text-md font-semibold text-gray-900 dark:text-white">
          TESTS
        </h5>

        <form action={createBlankUser} className="flex flex-col gap-1">
          <button
            disabled={!Boolean(loggedUserInDb)}
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create MERCHANT account
          </button>
          {Boolean(loggedUserInDb) ? (
            <p className="pl-1 text-xs text-green-800 dark:text-green-500">
              User exists in database
            </p>
          ) : (
            <p className="pl-1 text-xs text-red-800 dark:text-red-500">
              This user is not in the database
            </p>
          )}
          <p className="pl-1 text-xs text-gray-600 dark:text-gray-400">
            Creates a professional MERCHANT account for this user
          </p>
        </form>

        <div className="flex flex-col gap-1">
          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            // onClick={() => {
            //   toast.dismiss()
            //   toast.error("Not implemented yet")
            // }}
            type="submit"
          >
            Create RESELLER account
          </button>

          <p className="pl-1 text-xs text-gray-600 dark:text-gray-400">
            Creates a professional RESELLER account for this user
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            // onClick={() => {
            //   toast.dismiss()
            //   toast.error("Not implemented yet")
            // }}
          >
            Create CLIENT account
          </button>
          <p className="pl-1 text-xs text-gray-600 dark:text-gray-400">
            Creates a CLIENT account for this user
          </p>
        </div>
      </div>
      <div className="absolute right-4 top-4">
        <UserButton />
      </div>
    </div>
  )
}

export default Page
