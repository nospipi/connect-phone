import { Button } from "@/components/common/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/common/Dropdown"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/Select"

import { invitedUsers, roles, users } from "@/data/data"
import { RiAddLine, RiMore2Fill } from "@remixicon/react"
import Link from "next/link"

//-------------------------------------------------------------------

const Page = () => {
  return (
    <section
      className="flex flex-col gap-2"
      aria-labelledby="pending-invitations"
    >
      <div className="sm:flex sm:items-center sm:justify-end">
        <Link href={"/users/invite-user"}>
          <Button className="mt-4 w-full gap-2 sm:mt-0 sm:w-fit">
            <RiAddLine className="-ml-1 size-4 shrink-0" aria-hidden="true" />
            Invite user
          </Button>
        </Link>
      </div>
      <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-800">
        {invitedUsers.map((user) => (
          <li
            key={user.initials}
            className="flex items-center justify-between gap-x-6 py-2.5"
          >
            <div className="flex items-center gap-x-4">
              <span
                className="hidden size-9 shrink-0 items-center justify-center rounded-full border border-dashed border-gray-300 bg-white text-xs text-gray-700 sm:flex dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
                aria-hidden="true"
              >
                {user.initials}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500">
                  Expires in {user.expires} days
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue={user.role}>
                <SelectTrigger className="h-8 w-32">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent align="end">
                  {roles.map((role) => (
                    <SelectItem
                      key={role.value}
                      value={role.value}
                      disabled={role.value === "admin"}
                    >
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="group size-8 hover:border hover:border-gray-300 hover:bg-gray-50 data-[state=open]:border-gray-300 data-[state=open]:bg-gray-50 hover:dark:border-gray-700 hover:dark:bg-gray-900 data-[state=open]:dark:border-gray-700 data-[state=open]:dark:bg-gray-900"
                  >
                    <RiMore2Fill
                      className="size-4 shrink-0 text-gray-500 group-hover:text-gray-700 group-hover:dark:text-gray-400"
                      aria-hidden="true"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem
                    className="text-red-600 dark:text-red-500"
                    disabled={user.role === "admin"}
                  >
                    Revoke invitation
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Page
