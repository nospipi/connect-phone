import Image from "next/image"
import logo from "@/public/logo.png"
import PulsingRingProvider from "../providers/PulsingRingProvider.client"
import { currentUser } from "@clerk/nextjs/server"
import { UserButton } from "@clerk/nextjs"
import { getAllUsers } from "../server_actions"

//----------------------------------------------------------------------

const Page = async ({
  params,
}: {
  params: Promise<{ organization: string }>
}) => {
  const { organization } = await params
  const user = await currentUser()

  const fullName = user?.fullName || ""
  const primaryEmail = user?.primaryEmailAddress?.emailAddress || ""

  //   const userFromDB = await getUserByEmail(primaryEmail)

  //   console.log(userFromDB)

  //const users = await getUsers()
  //console.log(users)

  // const users = await db.user.findMany({
  //   orderBy: { id: "desc" },
  // })

  const users = await getAllUsers(organization)

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-10">
      <PulsingRingProvider color="blue" ringCount={3} size={2} speed={3}>
        <Image
          src={logo}
          alt="logo"
          width={30}
          height={30}
          className="transition-all duration-200 dark:invert"
        />
      </PulsingRingProvider>
      <div className="flex flex-col items-center gap-3">
        <UserButton />
        <span className="text-xs">{primaryEmail}</span>
        {users.map((user) => (
          <div
            key={user.id}
            className="bottom-1 flex min-w-full flex-col gap-2 border-b-2 border-dashed border-b-slate-600 border-opacity-50 pb-2"
          >
            <span>{user.email}</span>
            <span>{user.fullName}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page
