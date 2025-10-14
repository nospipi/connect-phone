"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/common/Dropdown"
import { cx, focusInput } from "@/lib/utils"
import {
  RiArrowRightSLine,
  RiExpandUpDownLine,
  RiCheckLine,
} from "@remixicon/react"
import React from "react"
import { useRouter } from "next/navigation"
import { IOrganizationWithUserRole } from "@connect-phone/shared-types"
import Image from "next/image"
import { logUserInOrganization } from "@/app/(backend)/server_actions/users/logUserInOrganization"

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

export const OrganizationsDropdownDesktop = ({
  organizations,
  loggedInOrganization,
}: {
  organizations: IOrganizationWithUserRole[]
  loggedInOrganization: number | null
}) => {
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const [hasOpenDialog, setHasOpenDialog] = React.useState(false)
  const focusRef = React.useRef<null | HTMLButtonElement>(null)

  const setSelectedOrgInDb = async (orgId: string) => {
    await logUserInOrganization(orgId)
    router.refresh()
  }

  const currentOrg = organizations?.find?.(
    (org) => org.id === loggedInOrganization,
  )
  return (
    <>
      <DropdownMenu
        open={dropdownOpen}
        onOpenChange={setDropdownOpen}
        modal={false}
      >
        <DropdownMenuTrigger asChild>
          <button
            className={cx(
              "flex w-full items-center gap-x-2.5 rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 hover:dark:bg-gray-900",
              focusInput,
            )}
          >
            {currentOrg?.logo?.url ? (
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded">
                <Image
                  src={currentOrg.logo.url}
                  alt={`${currentOrg.name} logo`}
                  width={32}
                  height={32}
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <span
                className="flex aspect-square size-8 items-center justify-center rounded bg-indigo-600 p-2 text-xs font-medium text-white dark:bg-indigo-500"
                aria-hidden="true"
              >
                {currentOrg ? getInitials(currentOrg.name) : "??"}
              </span>
            )}
            <div className="flex w-full items-center justify-between gap-x-4 truncate">
              <div className="truncate">
                <p className="truncate whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-50">
                  {currentOrg?.name || "Select Organization"}
                </p>
              </div>
              <RiExpandUpDownLine
                className="size-5 shrink-0 text-gray-500"
                aria-hidden="true"
              />
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          hidden={hasOpenDialog}
          onCloseAutoFocus={(event) => {
            if (focusRef.current) {
              focusRef.current.focus()
              focusRef.current = null
              event.preventDefault()
            }
          }}
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              Organizations ({organizations?.length})
            </DropdownMenuLabel>
            {organizations?.map((org) => {
              const isSelected = org.id === loggedInOrganization
              return (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() =>
                    !isSelected && setSelectedOrgInDb(String(org.id))
                  }
                  className={isSelected ? "bg-gray-50 dark:bg-gray-800" : ""}
                >
                  <div className="flex w-full items-center gap-x-2.5">
                    {org.logo?.url ? (
                      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded">
                        <Image
                          src={org.logo.url}
                          alt={`${org.name} logo`}
                          width={32}
                          height={32}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ) : (
                      <span
                        className="flex aspect-square size-8 items-center justify-center rounded bg-indigo-600 p-2 text-xs font-medium text-white dark:bg-indigo-500"
                        aria-hidden="true"
                      >
                        {getInitials(org.name)}
                      </span>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                        {org.name}
                      </p>
                      <p className="text-xs lowercase text-gray-500 first-letter:uppercase">
                        {org.role}
                      </p>
                    </div>
                    {isSelected && (
                      <RiCheckLine className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuGroup>

          {/* <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              router.push("/create-organization")
            }}
          >
            Add Organization
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export const OrganizationsDropdownMobile = ({
  organizations = [],
  loggedInOrganization,
}: {
  organizations: IOrganizationWithUserRole[]
  loggedInOrganization: number | null
}) => {
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const [hasOpenDialog, setHasOpenDialog] = React.useState(false)
  const focusRef = React.useRef<null | HTMLButtonElement>(null)

  const setSelectedOrgInDb = async (orgId: string) => {
    await logUserInOrganization(orgId)
    router.refresh()
  }

  const currentOrg = organizations?.find(
    (org) => org.id === loggedInOrganization,
  )

  return (
    <>
      {/* sidebar (xs-lg) */}
      <DropdownMenu
        open={dropdownOpen}
        onOpenChange={setDropdownOpen}
        modal={false}
      >
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-x-2 rounded-md p-2 hover:bg-gray-100 focus:outline-none hover:dark:bg-gray-900">
            {currentOrg?.logo?.url ? (
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded">
                <Image
                  src={currentOrg.logo.url}
                  alt={`${currentOrg.name} logo`}
                  width={32}
                  height={32}
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <span
                className={cx(
                  "flex aspect-square size-7 items-center justify-center rounded bg-indigo-600 p-2 text-xs font-medium text-white dark:bg-indigo-500",
                )}
                aria-hidden="true"
              >
                {currentOrg ? getInitials(currentOrg.name) : "??"}
              </span>
            )}

            <div className="flex w-full items-center justify-between gap-x-3 truncate">
              <p className="truncate whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-50">
                {currentOrg?.name || "Select Organization"}
              </p>
              <RiExpandUpDownLine
                className="size-4 shrink-0 text-gray-500"
                aria-hidden="true"
              />
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="!min-w-72"
          hidden={hasOpenDialog}
          onCloseAutoFocus={(event) => {
            if (focusRef.current) {
              focusRef.current.focus()
              focusRef.current = null
              event.preventDefault()
            }
          }}
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              Organizations ({organizations?.length})
            </DropdownMenuLabel>
            {organizations?.map((org) => {
              const isSelected = org.id === loggedInOrganization
              return (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() =>
                    !isSelected && setSelectedOrgInDb(String(org.id))
                  }
                  className={isSelected ? "bg-gray-50 dark:bg-gray-800" : ""}
                >
                  <div className="flex w-full items-center gap-x-2.5">
                    {org.logo?.url ? (
                      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded">
                        <Image
                          src={org.logo.url}
                          alt={`${org.name} logo`}
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <span
                        className="flex aspect-square size-8 items-center justify-center rounded bg-indigo-600 p-2 text-xs font-medium text-white dark:bg-indigo-500"
                        aria-hidden="true"
                      >
                        {getInitials(org.name)}
                      </span>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                        {org.name}
                      </p>
                      <p className="text-xs lowercase text-gray-500 first-letter:uppercase">
                        {org.role}
                      </p>
                    </div>
                    {isSelected && (
                      <RiCheckLine className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuGroup>

          {/* <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              router.push("/create-organization")
            }}
          >
            Add Organization
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
