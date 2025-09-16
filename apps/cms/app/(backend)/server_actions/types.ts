// apps/cms/app/(backend)/server_actions/types.ts

import {
  IAuditLog,
  ISalesChannel,
  IUser,
  IOrganization,
} from "@connect-phone/shared-types"

//----------------------------------------------------------------------
// Common Error Response Interface
//----------------------------------------------------------------------

export interface ErrorResponse {
  message: string
}

//----------------------------------------------------------------------
// Pagination Interfaces
//----------------------------------------------------------------------

export interface PaginationMeta {
  itemCount: number
  totalItems: number
  itemsPerPage: number
  totalPages: number
  currentPage: number
}

export interface PaginationLinks {
  first?: string
  previous?: string
  next?: string
  last?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  meta: PaginationMeta
  links: PaginationLinks
}

//----------------------------------------------------------------------
// User Organization Interface (matches your actual response)
//----------------------------------------------------------------------

export interface UserOrganization {
  id: number
  userId: number
  organizationId: number
  role: string
  user: {
    id: number
    createdAt: string
    email: string
    firstName: string
    lastName: string
    loggedOrganizationId: number | null
  }
}

//----------------------------------------------------------------------
// Specific Paginated Response Types
//----------------------------------------------------------------------

export interface PaginatedAuditLogsResponse
  extends PaginatedResponse<IAuditLog> {}

export interface PaginatedSalesChannelsResponse
  extends PaginatedResponse<ISalesChannel> {}

export interface PaginatedUsersResponse
  extends PaginatedResponse<UserOrganization> {}

//----------------------------------------------------------------------
// Common Server Action Parameters
//----------------------------------------------------------------------

export interface PaginationParams {
  page?: string | number
}
