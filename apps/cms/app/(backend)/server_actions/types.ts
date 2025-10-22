// apps/cms/app/(backend)/server_actions/types.ts
import {
  IAuditLog,
  ISalesChannel,
  IUserOrganization,
  IUserInvitation,
  IDateRange,
  IMedia,
  IPrice,
  IOfferInclusion,
  IOfferExclusion,
  IEsimOffer,
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
// Specific Paginated Response Types
//----------------------------------------------------------------------

export interface PaginatedAuditLogsResponse
  extends PaginatedResponse<IAuditLog> {}

export interface PaginatedSalesChannelsResponse
  extends PaginatedResponse<ISalesChannel> {}

export interface PaginatedUsersResponse
  extends PaginatedResponse<IUserOrganization> {}

export interface PaginatedInvitationsResponse
  extends PaginatedResponse<IUserInvitation> {}

export interface PaginatedDateRangesResponse
  extends PaginatedResponse<IDateRange> {}

export interface PaginatedMediaResponse extends PaginatedResponse<IMedia> {}

export interface PaginatedPricesResponse extends PaginatedResponse<IPrice> {}

export interface PaginatedOfferInclusionsResponse
  extends PaginatedResponse<IOfferInclusion> {}

export interface PaginatedOfferExclusionsResponse
  extends PaginatedResponse<IOfferExclusion> {}

export interface PaginatedEsimOffersResponse
  extends PaginatedResponse<IEsimOffer> {}
