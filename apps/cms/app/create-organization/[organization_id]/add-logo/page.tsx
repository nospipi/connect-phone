import LogoUpload from "./LogoUpload.client"
import FormAnimationProvider from "../../../create-organization/FormAnimationProvider.client"

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

                <div className="grid grid-cols-1 gap-y-8">
                  <LogoUpload orgId={organization_id} />
                </div>
              </div>
            </div>
          </div>
        </FormAnimationProvider>
      </div>
    </div>
  )
}

export default Page
