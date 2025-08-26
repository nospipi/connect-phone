"use server"

import axios, { AxiosInstance, AxiosError } from "axios"
import { auth } from "@clerk/nextjs/server"
import { IOrganizationWithUserRole } from "@connect-phone/shared-types"

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

export const getAllOrganizationsOfUser = async (): Promise<
  IOrganizationWithUserRole[]
> => {
  try {
    const api = createApiClient()
    const response = await api.get("/users/organizations")

    if (response.status !== 200) {
      throw new Error("Failed to fetch user organizations")
    }

    return response.data || []
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    console.error("Error getting user organizations:", errorMessage)
    throw new Error(errorMessage)
  }
}
