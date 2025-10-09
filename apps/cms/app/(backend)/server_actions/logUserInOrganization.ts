// apps/cms/app/(backend)/server_actions/logUserInOrganization.ts

"use server"

import { AxiosError } from "axios"
import { redirect } from "next/navigation"
import { headers as nextHeaders } from "next/headers"
import { revalidatePath } from "next/cache"
import { ErrorResponse } from "./types"
import { createApiClient } from "./api-client"

//----------------------------------------------------------------------

export const logUserInOrganization = async (
  organizationId: string,
): Promise<void> => {
  try {
    const headers = await nextHeaders()
    const currentPath = headers.get("x-current-path") || "/"
    const api = createApiClient()
    const response = await api.patch(
      `/users/log-in-organization/${organizationId}`,
    )

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to log user in organization")
    }
    revalidatePath(currentPath) //this does not make the page get new organization data
    //revalidatePath("/", "layout") //this does not do it either
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
