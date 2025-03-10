"use client"

import { useOrganization } from "@clerk/nextjs"
import { useState } from "react"

import axios from "axios"

const Invite = () => {
  const [isInviting, setIsInviting] = useState(false)
  const { organization } = useOrganization()

  return (
    <button
      onClick={async () => {
        setIsInviting(true)
        // await organization?.inviteMember({
        //   emailAddress: "getaways.magonezos@gmail.com",
        //   role: "admin",
        // })

        // const response = await clerkClient.invitations.createInvitation({
        //   emailAddress: "getaways.magonezos@gmail.com",
        //   redirectUrl: "/",
        //   publicMetadata: {
        //     example: "metadata",
        //     example_nested: {
        //       nested: "metadata",
        //     },
        //   },
        // })

        console.log(process.env.CLERK_SECRET_KEY)

        // const response = await axios.post(
        //   "https://api.clerk.com/v1/invitations",
        //   {
        //     email_address: "getaways.magonezos@gmail.com",
        //     redirect_url: "/",
        //     public_metadata: { role: "member" },
        //   },
        //   {
        //     headers: {
        //       Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        //       "Content-Type": "application/json",
        //       "Access-Control-Allow-Origin": "*",
        //     },
        //   },
        // )

        //console.log("Invitation created:", response.data)

        setIsInviting(false)
      }}
    >
      {isInviting ? "Inviting..." : "Invite"}
    </button>
  )
}

export default Invite
