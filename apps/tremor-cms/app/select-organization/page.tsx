import { Card } from "@/components/Card"
import { Button } from "@/components/Button"
import { Divider } from "@/components/Divider"
import { RiAddLine } from "@remixicon/react"
import { getUsers, getUser, createUser } from "database"
import Link from "next/link"
import OrganizationsSelector from "./OrganizationsSelector.client"

const organizations = [
  {
    id: "org-1",
    name: "Acme Corporation",
    role: "Admin",
    initials: "AC",
    color: "bg-indigo-600 dark:bg-indigo-500",
  },
  {
    id: "org-2",
    name: "Widget Industries",
    role: "Member",
    initials: "WI",
    color: "bg-emerald-600 dark:bg-emerald-500",
  },
  {
    id: "org-3",
    name: "Tech Solutions",
    role: "Member",
    initials: "TS",
    color: "bg-cyan-600 dark:bg-cyan-500",
  },
  {
    id: "org-4",
    name: "Global Ventures",
    role: "Admin",
    initials: "GV",
    color: "bg-violet-600 dark:bg-violet-500",
  },
]

const OrganizationSelectPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <h1>App Name</h1>
        </div>

        <Card className="shadow-md">
          <div className="px-1 py-2">
            <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
              Select Organization
            </h2>

            <OrganizationsSelector organizations={organizations} />

            <Divider className="my-4">or</Divider>

            <Link href="/org_id/overview">
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
