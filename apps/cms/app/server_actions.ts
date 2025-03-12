"use server"

import { User } from "db"
import axios, { AxiosInstance, AxiosError } from "axios"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { redirect, permanentRedirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { first } from "lodash"
import { id } from "date-fns/locale"
const BACKEND_URL = process.env.BACKEND_URL

interface ErrorResponse {
  message: string
}

const createApiClient = (organizationId?: string): AxiosInstance => {
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
      // Use the provided organizationId to be used in Organization guard in nest backend
      config.headers.Organization = organizationId
    } catch (error) {
      console.error("Error getting authentication token:", error)
    }

    return config
  })

  return api
}

//----------------------------------------------------------------------

export const getAllUsers = async (organizationId: string): Promise<User[]> => {
  console.log("Getting all users...", organizationId)
  try {
    const api = createApiClient(organizationId)
    // const { getToken } = await auth()
    // const token = await getToken()

    const response = await api.get("/users")
    return response.data
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback
    throw new Error(errorMessage)
  }
}

export const createOrganization = async (formData: FormData): Promise<void> => {
  let organizationId: string = "0" // Default fallback ID

  try {
    const clerk = await clerkClient()
    const { userId } = await auth()
    const api = createApiClient()
    const response = await api.post("/organizations", formData)
    organizationId = response.data.id

    await clerk.users.updateUserMetadata(userId || "", {
      privateMetadata: {
        internalOrgData: response.data,
      },
    })
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback
    throw new Error(errorMessage)
  }

  // redirect returns error by default, so cant be used in the try block
  redirect(`/create-organization/${organizationId}/add-logo`)
}

export const createBlankUser = async (): Promise<void> => {
  try {
    const clerk = await clerkClient()
    const { userId } = await auth()

    const api = createApiClient()
    const user = await currentUser()

    const payload = {
      email: user?.primaryEmailAddress?.emailAddress,
      firstName: user?.firstName,
      lastName: user?.lastName,
    }

    console.log("Creating blank user...", payload)

    const response = await api.post("/users/create_blank", payload)

    await clerk.users.updateUserMetadata(userId || "", {
      privateMetadata: {
        internalUserData: response.data,
      },
    })
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback
    throw new Error(errorMessage)
  }

  // redirect returns error by default, so cant be used in the try block
  redirect(`/create-organization`)
}

export const isLoggedUserInDb = async (): Promise<boolean> => {
  try {
    const api = createApiClient()
    const Dbuser = await api.get(`/users/logged_user_is_in_db`)
    return Dbuser.data ? true : false
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback
    throw new Error(errorMessage)
  }
}

export const getAuthToken = async (): Promise<string | null> => {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    return token
  } catch (error) {
    console.error("Error getting authentication token:", error)
    throw new Error("Error getting authentication token")
  }
}

export const getCurrentUserFromBackend = async (): Promise<User | null> => {
  const token = await getAuthToken()
  if (!token) {
    return null
  }
  try {
    const api = createApiClient()
    const response = await api.get("/users/logged_user_in_db")
    return response.data || null
  } catch (error: unknown) {
    console.error("Error getting current user from backend:", error)
    return null
  }
}

export const addLogoUrlToOrganization = async (
  logoUrl: string,
): Promise<void> => {
  try {
    const user = await currentUser()

    interface InternalOrgData {
      id: string
    }

    const internalOrgData = user?.privateMetadata?.internalOrgData as
      | InternalOrgData
      | undefined
    const organizationId: string = internalOrgData?.id ?? "0"

    const api = createApiClient(organizationId)
    await api.post(`/organizations/add_logo_url_to_organization`, {
      id: organizationId.toString(),
      logoUrl: logoUrl,
    })
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback
    throw new Error(errorMessage)
  }
}
