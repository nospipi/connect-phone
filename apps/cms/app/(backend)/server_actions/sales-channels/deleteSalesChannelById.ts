// apps/cms/app/(backend)/server_actions/deleteSalesChannel.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const deleteSalesChannelById = async (
  formData: FormData,
): Promise<void> => {
  try {
    const id = Number(formData.get("salesChannelId"))
    console.log("Deleting sales channel with ID:", id)

    const api = createApiClient()
    const response = await api.delete(`/sales-channels/${id}`)

    if (response.status !== 200) {
      throw new Error("Failed to delete sales channel")
    }

    console.log("Sales channel deleted successfully:", response.data)

    // Revalidate the sales channels page after deletion
    revalidatePath("/sales-channels")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to delete sales channel:", errorMessage)
    throw new Error(errorMessage)
  } finally {
    redirect("/sales-channels")
  }
}
