// apps/cms/app/(backend)/server_actions/updateOrganization.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ErrorResponse } from "./types"
import { createApiClient } from "./api-client"

//----------------------------------------------------------------------

export const updateOrganization = async (formData: FormData): Promise<void> => {
  try {
    const name = formData.get("name") as string
    const logoUrl = formData.get("logoUrl") as string
    const mainCurrency = formData.get("mainCurrency") as string

    const payload = {
      name: name || undefined,
      logoUrl: logoUrl === "" ? null : logoUrl || undefined,
      mainCurrency: mainCurrency || undefined,
    }

    console.log("Updating organization:", payload)

    const api = createApiClient()
    const response = await api.put("/organizations/current", payload)

    if (response.status !== 200) {
      throw new Error("Failed to update organization")
    }

    console.log("Organization updated successfully:", response.data)

    revalidatePath("/organization/details")
    revalidatePath("/")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to update organization:", errorMessage)
    throw new Error(errorMessage)
  }

  redirect("/organization/details")
}
