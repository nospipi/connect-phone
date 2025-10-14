// apps/cms/app/(backend)/server_actions/sales-channels/updateSalesChannel.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const updateSalesChannel = async (formData: FormData): Promise<void> => {
  try {
    const id = Number(formData.get("id"))
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const logoId = formData.get("logoId") as string
    const isActive = formData.get("isActive") as string

    if (!name) {
      throw new Error("Name is required")
    }

    const payload = {
      name,
      description,
      logoId: logoId === "" ? null : logoId ? parseInt(logoId, 10) : undefined,
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
