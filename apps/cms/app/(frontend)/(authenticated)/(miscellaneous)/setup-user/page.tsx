import Image from "next/image"
import logo from "@/public/logo.png"
import PulsingRingProvider from "@/app/providers/PulsingRingProvider.client"
import { currentUser } from "@clerk/nextjs/server"
import { UserButton } from "@clerk/nextjs"

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
      </div>
    </div>
  )
}

export default Page
