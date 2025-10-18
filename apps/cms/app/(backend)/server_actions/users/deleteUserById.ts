// apps/cms/app/(backend)/server_actions/deleteUserById.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const deleteUserById = async (formData: FormData): Promise<void> => {
  try {
    // Extract user ID from form data
    const userId = formData.get("userId") as string

    // Validate required field
    if (!userId) {
      throw new Error("User ID is required")
    }

    const api = createApiClient()
    const response = await api.delete(`/users/${userId}`)

    if (response.status !== 200 && response.status !== 204) {
      throw new Error("Failed to delete user")
    }

    // Revalidate the users page after deletion
    revalidatePath("/users/users")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to delete user:", errorMessage)
    throw new Error(errorMessage)
  }

  redirect("/users/users")
}
