// apps/cms/app/(backend)/server_actions/sales-channels/createNewSalesChannel.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const createNewSalesChannel = async (
  formData: FormData,
): Promise<void> => {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const logoId = formData.get("logoId") as string
    const isActive = formData.get("isActive") as string

    if (!name) {
      throw new Error("Name is required")
    }

    console.log("Creating new sales channel:", {
      name,
      description: description || undefined,
      logoId: logoId === "" ? null : logoId ? parseInt(logoId, 10) : undefined,
      isActive: Boolean(isActive),
    })

    const api = createApiClient()
    const response = await api.post("/sales-channels/new", {
      name,
      description: description || undefined,
      logoId: logoId === "" ? null : logoId ? parseInt(logoId, 10) : undefined,
      isActive: Boolean(isActive),
    })

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to create sales channel")
    }

    console.log("Sales channel created successfully:", response.data)

    revalidatePath("/sales-channels")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to create sales channel:", errorMessage)
    throw new Error(errorMessage)
  }

  redirect("/sales-channels")
}
