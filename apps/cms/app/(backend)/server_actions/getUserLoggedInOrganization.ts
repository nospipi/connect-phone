"use server"

import axios, { AxiosInstance, AxiosError } from "axios"
import { auth } from "@clerk/nextjs/server"

interface ErrorResponse {
  message: string
}

//----------------------------------------------------------------------

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

//--------------------------------------------------------------------------------

export const getUserLoggedInOrganization = async (): Promise<number | null> => {
  try {
    const api = createApiClient()
    const response = await api.get("/users/get-logged-organization")

    if (response.status !== 200) {
      throw new Error("Failed to check user organization status")
    }

    return response.data || []
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Error getting user organization status:", errorMessage)
    throw new Error(errorMessage)
  }
}
