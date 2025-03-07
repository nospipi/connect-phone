import Image from "next/image"
import logo from "@/public/logo.png"
import PulsingRingProvider from "./PulsingRingProvider.client"
import { currentUser } from "@clerk/nextjs/server"
import { UserButton } from "@clerk/nextjs"
import { getUserByEmail, getUsers } from "database"

//----------------------------------------------------------------------

const Page = async () => {
  const user = await currentUser()

  const fullName = user?.fullName || ""
  const primaryEmail = user?.primaryEmailAddress?.emailAddress || ""

  //   const userFromDB = await getUserByEmail(primaryEmail)

  //   console.log(userFromDB)

  const users = await getUsers()
  console.log(users)

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-10">
      <PulsingRingProvider color="indigo" ringCount={3} size={2} speed={3}>
        <Image
          src={logo}
          alt="logo"
          width={30}
          height={30}
          className="transition-all duration-200 dark:invert"
        />
      </PulsingRingProvider>
      <div className="flex items-center gap-3">
        <UserButton />
        <span className="text-xs">{fullName}</span>
      </div>
    </div>
  )
}

export default Page
