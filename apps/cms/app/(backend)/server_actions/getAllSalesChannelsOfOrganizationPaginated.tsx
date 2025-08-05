"use server"

import axios, { AxiosInstance, AxiosError } from "axios"
import { auth } from "@clerk/nextjs/server"
import { SalesChannel } from "@connect-phone/shared-types"

interface ErrorResponse {
  message: string
}

//-------------------------------------------------------------

// Interface to match the backend pagination response
export interface PaginationMeta {
  itemCount: number
  totalItems: number
  itemsPerPage: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  nextPage: number | null
  previousPage: number | null
}

export interface PaginationLinks {
  first?: string
  previous?: string
  next?: string
  last?: string
}

export interface PaginatedSalesChannelsResponse {
  items: SalesChannel[]
  meta: PaginationMeta
  links: PaginationLinks
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

//----------------------------------------------------------------------

export const getAllSalesChannelsOfOrganizationPaginated = async ({
  organizationId,
  page = 1,
  limit = 10,
}: {
  organizationId: number
  page?: number
  limit?: number
}): Promise<PaginatedSalesChannelsResponse> => {
  try {
    console.log(
      "Fetching sales channels for organization ID:",
      organizationId,
      "page:",
      page,
      "limit:",
      limit,
    )

    const api = createApiClient()
    const response = await api.get(
      `/sales-channels/organization/${organizationId}/paginated`,
      {
        params: {
          page,
          limit,
        },
      },
    )

    if (response.status !== 200) {
      throw new Error("Failed to fetch sales channels")
    }

    return response.data
  } catch (error: unknown) {
    const messageFallback = (error as Error).message ?? "An error occurred"
    const errorMessage =
      (error as AxiosError<ErrorResponse>).response?.data.message ??
      messageFallback

    throw new Error(errorMessage)
  }
}
