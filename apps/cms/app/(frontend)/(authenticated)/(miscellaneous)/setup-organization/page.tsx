import { getCurrentStep } from "./server_actions"
import SetupWorkspace from "./SetupWorkspace.client"
import Image from "next/image"
import logo from "@/public/logo.png"

//----------------------------------------------------------------------

export default async function SetupPage() {
  const { step, complete } = await getCurrentStep()

  if (complete) {
    //maybe redirect directly ?
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <Image
        src={logo}
        alt="logo"
        width={30}
        height={30}
        className="fixed left-4 top-4 transition-all duration-200 dark:invert"
      />
      <div className="w-full max-w-md">
        <SetupWorkspace currentStep={step} isComplete={complete} />
      </div>
    </div>
  )
}
