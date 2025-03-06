import { getCurrentStep } from "./server_actions"
import SetupWorkspace from "./SetupWorkspace.client"

export default async function SetupPage() {
  const { step, complete } = await getCurrentStep()

  if (complete) {
    //maybe redirect directly ?
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <SetupWorkspace currentStep={step} isComplete={complete} />
      </div>
    </div>
  )
}
