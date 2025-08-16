// import { UserButton } from "@clerk/nextjs"
// import Link from "next/link"

// //----------------------------------------------------------------------

// const Page = () => {
//   return (
//     <div className="relative flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
//       <span>HOME</span>
//       <div className="absolute left-4 top-4 flex max-w-xs flex-col gap-4">
//         <div className="flex flex-col gap-1">
//           <Link href="/tests-page">
//             <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
//               Visit the tests page
//             </button>
//           </Link>
//           <Link href="/overview">
//             <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
//               Dashboard
//             </button>
//           </Link>
//         </div>
//       </div>
//       <div className="absolute right-4 top-4">
//         <UserButton />
//       </div>
//     </div>
//   )
// }

// export default Page

import { Card } from "@/components/common/Card"
import { Button } from "@/components/common/Button"
import { Divider } from "@/components/common/Divider"
import { RiAddLine } from "@remixicon/react"
import Link from "next/link"
import OrganizationsSelector from "./OrganizationsSelector.client"
import UserButton from "./UserButton"
import Image from "next/image"
import logo from "@/public/logo.png"

//----------------------------------------------------------------------

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

            <OrganizationsSelector organizations={organizations} />

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
