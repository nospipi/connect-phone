"use server"

import axios, { AxiosInstance, AxiosError } from "axios"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { SalesChannel } from "@connect-phone/shared-types"

//----------------------------------------------------------------------

interface ErrorResponse {
  message: string
}

interface CreateSalesChannelParams {
  name: string
  description?: string
  organizationUuid: string
}

//--------------------------------------------------------------

const createApiClient = (): AxiosInstance => {
  const api = axios.create({
    baseURL: process.env.BACKEND_URL,
    headers: {
      "Content-Type": "application/json",
    },
  })

  api.interceptors.request.use(async (config) => {
    try {
      const { getToken } = await auth()
      const token = await getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error("Error getting authentication token:", error)
    }

    return config
  })

  return api
}

//----------------------------------------------------------------------

export const createNewSalesChannel = async ({
  name,
  description,
  organizationUuid,
}: CreateSalesChannelParams): Promise<SalesChannel> => {
  try {
    console.log("Creating new sales channel:", {
      name,
      description,
      organizationUuid,
    })

    const api = createApiClient()
    const response = await api.post("/sales-channels/new", {
      name,
      description,
      organizationUuid,
    })

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to create sales channel")
    }

    // Revalidate the sales channels page after creating a new one
    revalidatePath("/settings/sales-channels")

    console.log("Sales channel created successfully:", response.data)
    return response.data
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Failed to create sales channel:", errorMessage)
    throw new Error(errorMessage)
  }
}
