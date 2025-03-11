import { DropdownUserProfile } from "@/components/ui/navigation/DropdownUserProfile"
import { Button } from "@/components/Button"
import { UserButton as ClerkUserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import _ from "lodash"

//-------------------------------------------------------------------------

const UserButton = async () => {
  const user = await currentUser()
  const fullName = user?.fullName || ""
  const primaryEmail = user?.primaryEmailAddress?.emailAddress

  return (
    <DropdownUserProfile>
      <Button
        aria-label="User settings"
        variant="ghost"
        className={
          "group flex w-full items-center justify-between rounded-md p-2 text-sm font-medium text-gray-900 hover:bg-gray-100 data-[state=open]:bg-gray-100 data-[state=open]:bg-gray-400/10 hover:dark:bg-gray-400/10"
        }
      >
        <span className="flex items-center gap-3">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
            aria-hidden="true"
          >
            <ClerkUserButton />
          </span>
          <span>{fullName || primaryEmail}</span>
        </span>
      </Button>
    </DropdownUserProfile>
  )
}

export default UserButton
