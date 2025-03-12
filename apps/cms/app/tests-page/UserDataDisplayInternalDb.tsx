// components/UserDataDisplay.tsx
import { getCurrentUserFromBackend } from "@/app/server_actions"
import RevalidateButton from "./RevalidateButton.client"

const UserDataDisplayInternalDb = async () => {
  const userData = await getCurrentUserFromBackend()
  const hasUserData = userData !== null && userData !== undefined

  return (
    <div className="flex h-full flex-col rounded-md border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Current User Internal DB
        </span>

        <RevalidateButton />
      </div>

      {!hasUserData ? (
        <div className="mt-2 text-amber-600 dark:text-amber-400">
          <p className="text-xs">No user data available</p>
        </div>
      ) : (
        <div className="mt-2 flex flex-1 flex-col overflow-hidden rounded bg-gray-50 p-2 dark:bg-gray-900">
          <pre className="h-full w-full overflow-y-auto break-all font-mono text-xs text-gray-600 dark:text-gray-400">
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default UserDataDisplayInternalDb
