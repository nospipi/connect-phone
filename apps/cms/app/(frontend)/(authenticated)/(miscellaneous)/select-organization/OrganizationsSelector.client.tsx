"use client"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/Select"
import { Button } from "@/components/common/Button"
import { RiArrowRightSLine } from "@remixicon/react"
import { cx } from "@/lib/utils"
import { useRouter } from "next/navigation"

//-----------------------------------------------------------------------------

const OrganizationsSelector = ({ organizations }: { organizations: any }) => {
  const [selectedOrg, setSelectedOrg] = useState("")
  const router = useRouter()
  return (
    <>
      <Select value={selectedOrg} onValueChange={setSelectedOrg}>
        <SelectTrigger className="mb-4 w-full">
          <SelectValue placeholder="Select an organization" />
        </SelectTrigger>
        <SelectContent>
          {organizations.map((org: any) => (
            <SelectItem key={org.id} value={org.id} className="py-2">
              <div className="flex items-center gap-2">
                <span
                  className={cx(
                    org.color,
                    "flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium text-white",
                  )}
                >
                  {org.initials}
                </span>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{org.name}</span>
                  <span className="text-xs text-gray-500">{org.role}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={() => router.push(`/${selectedOrg}/overview`)}
        className="mt-2 flex w-full items-center justify-center"
        disabled={!selectedOrg}
      >
        Continue
        <RiArrowRightSLine className="ml-2 h-4 w-4" />
      </Button>
    </>
  )
}

export default OrganizationsSelector
