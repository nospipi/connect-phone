// apps/cms/app/(backend)/server_actions/esim-offers/createEsimOffer.ts
"use server"

import { AxiosError } from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ErrorResponse } from "../types"
import { createApiClient } from "../api-client"

//----------------------------------------------------------------------

export const createEsimOffer = async (formData: FormData): Promise<void> => {
  try {
    const title = formData.get("title") as string
    const descriptionHtml = formData.get("descriptionHtml") as string
    const descriptionText = formData.get("descriptionText") as string
    const durationInDays = formData.get("durationInDays") as string
    const dataInGb = formData.get("dataInGb") as string
    const isUnlimitedData = formData.get("isUnlimitedData") as string
    const isActive = formData.get("isActive") as string
    const inclusionIds = formData.get("inclusionIds") as string
    const exclusionIds = formData.get("exclusionIds") as string
    const mainImageId = formData.get("mainImageId") as string
    const imageIds = formData.get("imageIds") as string
    const countryIds = formData.get("countryIds") as string
    const salesChannelIds = formData.get("salesChannelIds") as string
    const priceIds = formData.get("priceIds") as string

    if (!title || !descriptionHtml || !descriptionText || !durationInDays) {
      throw new Error("Title, description, and duration are required")
    }

    const isUnlimited = isUnlimitedData === "true"

    if (!isUnlimited && !dataInGb) {
      throw new Error("Data amount is required when not unlimited")
    }

    const payload = {
      title,
      descriptionHtml,
      descriptionText,
      durationInDays: parseInt(durationInDays, 10),
      dataInGb: isUnlimited ? null : parseFloat(dataInGb),
      isUnlimitedData: isUnlimited,
      isActive: isActive ? isActive === "true" : true,
      inclusionIds: inclusionIds ? JSON.parse(inclusionIds) : [],
      exclusionIds: exclusionIds ? JSON.parse(exclusionIds) : [],
      mainImageId: mainImageId ? parseInt(mainImageId, 10) : null,
      imageIds: imageIds ? JSON.parse(imageIds) : [],
      countryIds: countryIds ? JSON.parse(countryIds) : [],
      salesChannelIds: salesChannelIds ? JSON.parse(salesChannelIds) : [],
      priceIds: priceIds ? JSON.parse(priceIds) : [],
    }

    const api = createApiClient()
    const response = await api.post("/esim-offers/new", payload)

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to create eSIM offer")
    }

    revalidatePath("/inventory/offers")
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to create eSIM offer:", errorMessage)
    throw new Error(errorMessage)
  }

  redirect("/inventory/offers")
}
