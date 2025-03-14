// Define the types for our data structure

// Product information
export interface Product {
  id: string
  title: string
  description?: string
  imageUrl?: string
  options: ProductOption[]
}

export interface ProductOption {
  id: string
  title: string
  description?: string
}

// Booking information
export interface Booking {
  id: string
  name: string
  date: string
  status: "Confirmed" | "Pending" | "Cancelled"
  amount: number
  email?: string
  phone?: string
  guests?: number
}

// Tour Group
export interface TourGroup {
  id: string
  product_id: string
  option_id?: string
  start_time?: string
  end_time?: string
  bookings: string[] // Array of booking IDs
  bookingData?: Booking[] // Populated booking data
}

// Group of Tour Groups
export interface GroupOfTourGroups {
  id: string
  product_id: string
  tour_groups: string[] // Array of tour group IDs
  productData?: Product // Populated product data
  tourGroupData?: TourGroup[] // Populated tour group data
}
