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
import { useRouter } from "next/navigation"
import { IOrganization } from "@connect-phone/shared-types"
import { logUserInOrganization } from "./(backend)/server_actions/logUserInOrganization"
import Image from "next/image"

//-----------------------------------------------------------------------------
const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/)
  // Filter out words that are just symbols (like "-", "&", etc.)
  const realWords = words.filter((word) => /[a-zA-Z]/.test(word))

  if (realWords.length >= 2) {
    // Take first letter of first two real words
    return (realWords[0][0] + realWords[1][0]).toUpperCase()
  } else if (realWords.length === 1) {
    // Take first two letters of single word
    return realWords[0].substring(0, 2).toUpperCase()
  } else {
    // Fallback if no real words found
    return "??"
  }
}
const OrganizationsSelector = ({
  organizations,
}: {
  organizations: IOrganization[]
}) => {
  const [selectedOrg, setSelectedOrg] = useState("")
  const router = useRouter()

  const setSelectedOrgInDb = async (orgId: string) => {
    await logUserInOrganization(orgId)
    router.refresh()
  }

  return (
    <>
      <Select value={selectedOrg} onValueChange={setSelectedOrg}>
        <SelectTrigger className="mb-4 w-full">
          <SelectValue placeholder="Select an organization" />
        </SelectTrigger>
        <SelectContent>
          {organizations.map((org: IOrganization) => (
            <SelectItem
              key={org.createdAt}
              value={String(org.id)}
              className="py-2"
            >
              <div className="flex items-center gap-2">
                {org.logoUrl ? (
                  <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md">
                    <Image
                      src={org.logoUrl}
                      alt={`${org.name} logo`}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-500 text-xs font-medium text-white">
                    {getInitials(org.name)}
                  </span>
                )}
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{org.name}</span>
                  <span className="text-xs text-gray-500">ADMIN</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={() => setSelectedOrgInDb(selectedOrg)}
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
