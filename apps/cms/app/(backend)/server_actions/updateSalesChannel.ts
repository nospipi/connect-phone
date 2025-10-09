// apps/cms/app/(backend)/server_actions/updateSalesChannel.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ErrorResponse } from "./types"
import { createApiClient } from "./api-client"

//----------------------------------------------------------------------

export const updateSalesChannel = async (formData: FormData): Promise<void> => {
  try {
    const id = Number(formData.get("id"))
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const logoUrl = formData.get("logoUrl") as string
    const isActive = formData.get("isActive") as string

    // Validate required fields
    if (!name) {
      throw new Error("Name is required")
    }

    // Note: description can be empty string to clear the field
    const payload = {
      name,
      description, // This will be empty string if user wants to clear it
      logoUrl: logoUrl || null, // Convert empty string to null to clear existing logo
      isActive: Boolean(isActive),
    }

    console.log("Updating sales channel:", {
      id,
      ...payload,
    })

    const api = createApiClient()
    const response = await api.put(`/sales-channels/${id}`, payload)

    if (response.status !== 200) {
      throw new Error("Failed to update sales channel")
    }

    // Revalidate the sales channels page after updating
    revalidatePath("/sales-channels")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to update sales channel:", errorMessage)
    throw new Error(errorMessage)
  }

  redirect("/sales-channels")
}
