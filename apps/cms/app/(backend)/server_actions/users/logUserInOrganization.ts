// apps/cms/app/(backend)/server_actions/logUserInOrganization.ts

"use server"

import { AxiosError } from "axios"
import { redirect } from "next/navigation"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const logUserInOrganization = async (
  organizationId: string,
): Promise<void> => {
  try {
    const api = createApiClient()
    const response = await api.patch(
      `/users/log-in-organization/${organizationId}`,
    )

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to log user in organization")
    }
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to log user in organization:", errorMessage)
    redirect(`/?error=${encodeURIComponent(errorMessage)}`)
  }

  //redirect("/")
}
