// apps/cms/app/(backend)/server_actions/logoutUserFromOrganization.ts

"use server"

import { AxiosError } from "axios"
import { redirect } from "next/navigation"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const logoutUserFromOrganization = async (): Promise<void> => {
  try {
    console.log("Logging user out of organization")
    const api = createApiClient()
    const response = await api.patch(`/users/log-out-organization`)

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to log user out of organization")
    }
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to log user out of organization:", errorMessage)
    redirect(`/?error=${encodeURIComponent(errorMessage)}`)
  }

  //redirect("/")
}
