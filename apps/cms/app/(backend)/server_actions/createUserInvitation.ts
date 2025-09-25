// apps/cms/app/(backend)/server_actions/createUserInvitation.ts

"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ErrorResponse } from "./types"
import { createApiClient } from "./api-client"

//----------------------------------------------------------------------

export const createUserInvitation = async (
  formData: FormData,
): Promise<void> => {
  try {
    // Extract form data
    const email = formData.get("email") as string
    const role = formData.get("role") as string

    // Validate required fields
    if (!email) {
      throw new Error("Email is required")
    }

    if (!role) {
      throw new Error("Role is required")
    }

    console.log("Creating new user invitation:", {
      email: email,
      role: role,
    })

    const api = createApiClient()
    const response = await api.post("/invitations/new", {
      email: email,
      role: role,
    })

    //console.log("Response from API:", response.data)

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to create user invitation")
    }

    console.log("User invitation created successfully:", response.data)

    // Revalidate the user invitations page after creating a new one
    revalidatePath("/users/invitations")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to create user invitation:", errorMessage)
    throw new Error(errorMessage)
  }

  redirect("/users/invitations")
}
