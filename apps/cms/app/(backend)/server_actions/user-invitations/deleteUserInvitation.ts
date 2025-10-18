// apps/cms/app/(backend)/server_actions/deleteUserInvitation.tsx
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const deleteUserInvitation = async (
  formData: FormData,
): Promise<void> => {
  try {
    // Extract invitation ID from form data
    const invitationId = formData.get("invitationId") as string

    // Validate required field
    if (!invitationId) {
      throw new Error("Invitation ID is required")
    }

    const api = createApiClient()
    const response = await api.delete(`/invitations/${invitationId}`)

    if (response.status !== 200 && response.status !== 204) {
      throw new Error("Failed to delete user invitation")
    }

    // Revalidate the invitations page after deletion
    revalidatePath("/users/invitations")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to delete user invitation:", errorMessage)
    throw new Error(errorMessage)
  }
}
