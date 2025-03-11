import LogoUpload from "./LogoUpload.client"
import Link from "next/link"
import FormAnimationProvider from "../../../create-organization/FormAnimationProvider.client"
import { getAllUsers } from "@/app/server_actions"

//--------------------------------------------

const Page = async ({
  params,
}: {
  params: Promise<{ organization_id: string }>
}) => {
  // throw new Error("Test error")
  const { organization_id } = await params
  // console.log("Organization:", organization_id)

  // const users = await getAllUsers(organization_id)
  // console.log("Users:", users)

  return (
    <div className="h-screen w-full bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto flex h-full w-full items-center justify-center">
        <FormAnimationProvider>
          <div className="w-full min-w-[320px] max-w-xl">
            <div className="h-full max-h-[90vh] overflow-y-auto p-6">
              <div className="px-2 py-4">
                <div className="mb-8 flex items-center">
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Add your organization logo
                  </h1>
                </div>

                <form>
                  <div className="grid grid-cols-1 gap-y-8">
                    <LogoUpload />

                    <div className="mt-8">
                      <Link href="/setup-organization">
                        <button
                          //type="submit"
                          className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        >
                          Add logo
                        </button>
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </FormAnimationProvider>
      </div>
    </div>
  )
}

export default Page
