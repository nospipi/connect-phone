import { SignIn } from "@clerk/nextjs"

const Page = async () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <SignIn />
    </div>
  )
}

export default Page
