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
    const isActive = formData.get("isActive") as string

    // Validate required fields
    if (!name) {
      throw new Error("Name is required")
    }

    console.log("Updating sales channel:", {
      id,
      name,
      description: description || undefined,
      isActive: Boolean(isActive),
    })

    const api = createApiClient()
    const response = await api.put(`/sales-channels/${id}`, {
      name,
      description: description || undefined,
      isActive: Boolean(isActive),
    })

    if (response.status !== 200) {
      throw new Error("Failed to update sales channel")
    }

    console.log("Sales channel updated successfully:", response.data)

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
