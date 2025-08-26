import { redirect } from "next/navigation"
import { Card } from "@/components/common/Card"
import { Button } from "@/components/common/Button"
import { Divider } from "@/components/common/Divider"
import { RiAddLine } from "@remixicon/react"
import Link from "next/link"
import OrganizationsSelector from "./OrganizationsSelector.client"
import { getAllOrganizationsOfUser } from "./(backend)/server_actions/getAllOrganizationsOfUser"
import { isUserLoggedInOrganization } from "./(backend)/server_actions/isUserLoggedInOrganization"
import { getUserLoggedInOrganization } from "./(backend)/server_actions/getUserLoggedInOrganization"
import UserButton from "./UserButton"
import Image from "next/image"
import logo from "@/public/logo.png"

//----------------------------------------------------------------------

const OrganizationSelectPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const params = await searchParams

  // If there's an error param, just throw it
  if (params.error) {
    const errorMessage = Array.isArray(params.error)
      ? params.error[0]
      : params.error
    throw new Error(errorMessage)
  }

  const organizations = await getAllOrganizationsOfUser()
  const loggedInStatus = await isUserLoggedInOrganization()
  const loggedInOrganization = await getUserLoggedInOrganization()

  //i will use this to redirect to overview directly before showing ui
  if (loggedInStatus?.loggedIn) {
    // Redirect to overview page
    redirect("/overview")
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="absolute right-4 top-4">
        <UserButton />
      </div>
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Image
            src={logo}
            alt="logo"
            width={50}
            height={50}
            className="transition-all duration-200 dark:invert"
          />
        </div>

        <Card className="shadow-md">
          <div className="px-1 py-2">
            <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
              Select Organization
            </h2>

            <OrganizationsSelector
              organizations={organizations}
              loggedInOrganization={loggedInOrganization}
            />

            <Divider className="my-4">or</Divider>

            <Link href="/create-organization">
              <Button
                variant="secondary"
                className="flex w-full items-center justify-center gap-2"
              >
                <RiAddLine className="h-4 w-4" />
                Create New Organization
              </Button>
            </Link>
          </div>
        </Card>

        <p className="mt-6 text-center text-sm text-gray-500">
          Need help?{" "}
          <a
            href="#"
            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  )
}

export default OrganizationSelectPage
