import { UserButton } from "@clerk/nextjs"
import {
  createBlankUser,
  isLoggedUserInDb,
  getAuthToken,
} from "@/app/server_actions"
import AuthTokenDisplay from "./AuthTokenDisplay.client"
import UserDataDisplayClerk from "./UserDataDisplayClerk"
import UserDataDisplayInternalDb from "./UserDataDisplayInternalDb"
import { Tooltip } from "@/components/Tooltip"

//----------------------------------------------------------------------

const Page = async () => {
  const loggedUserInDb = await isLoggedUserInDb()

  const authToken = await getAuthToken()

  return (
    <div className="relative flex h-screen min-h-screen flex-col overflow-auto bg-gray-50 p-4 dark:bg-gray-900">
      <div className="flex max-w-xs flex-1 flex-col gap-4">
        <h5 className="text-md font-semibold text-gray-900 dark:text-white">
          TESTS
        </h5>

        {loggedUserInDb ? (
          <p className="pl-1 text-xs text-green-800 dark:text-green-500">
            User already has an account
          </p>
        ) : (
          <p className="pl-1 text-xs text-red-800 dark:text-red-500">
            User does not have an account
          </p>
        )}

        <form action={createBlankUser} className="flex flex-col gap-1">
          <Tooltip
            content="The user has already an account"
            triggerAsChild
            side="right"
            disabled={!loggedUserInDb}
          >
            <button
              className={`rounded bg-blue-600 p-2 text-white hover:bg-blue-700 ${loggedUserInDb ? "cursor-not-allowed opacity-50" : ""}`}
              disabled={loggedUserInDb}
              // onClick={async () => {
              //   // Implement merchant account creation logic
              // }}
              type="submit"
            >
              Create MERCHANT account
            </button>
          </Tooltip>

          <p className="pl-1 text-xs text-gray-600 dark:text-gray-400">
            Creates a professional MERCHANT account for this user
          </p>
        </form>

        <div className="flex flex-col gap-1">
          <button
            className={`rounded bg-blue-600 p-2 text-white hover:bg-blue-700 ${loggedUserInDb ? "cursor-not-allowed opacity-50" : ""}`}
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
            className={`rounded bg-blue-600 p-2 text-white hover:bg-blue-700 ${loggedUserInDb ? "cursor-not-allowed opacity-50" : ""}`}
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
        <AuthTokenDisplay token={authToken} />
        <UserDataDisplayInternalDb />
        <UserDataDisplayClerk />
      </div>

      <div className="fixed right-4 top-4">
        <UserButton />
      </div>
    </div>
  )
}

export default Page
