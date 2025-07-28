import { Booking, GroupOfTourGroups, Product, TourGroup } from "./types"

// Mock products data
export const products: Record<string, Product> = {
  "4455": {
    id: "4455",
    title: "Walking Tour of Historic Downtown",
    description:
      "Explore the hidden gems of our historic downtown with expert guides.",
    imageUrl: "/api/placeholder/400/200",
    options: [
      {
        id: "opt-1",
        title: "Standard Tour",
        description: "2-hour walking tour with guide",
      },
      {
        id: "opt-2",
        title: "Extended Tour",
        description: "3-hour walking tour with guide and refreshments",
      },
    ],
  },
  "4456": {
    id: "4456",
    title: "Culinary Experience Tour",
    description:
      "Taste the flavors of local cuisine with our expert food guides.",
    imageUrl: "/api/placeholder/400/200",
    options: [
      {
        id: "opt-3",
        title: "Lunch Tour",
        description: "3-hour food tasting tour at lunch time",
      },
      {
        id: "opt-4",
        title: "Dinner Tour",
        description: "4-hour evening food tour with wine pairings",
      },
    ],
  },
}

// Mock bookings data
export const bookings: Record<string, Booking> = {
  "b-1": {
    id: "b-1",
    name: "John Doe",
    date: "2025-04-10",
    status: "Confirmed",
    amount: 249.99,
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    guests: 2,
  },
  "b-2": {
    id: "b-2",
    name: "Emma Johnson",
    date: "2025-04-12",
    status: "Pending",
    amount: 149.5,
    email: "emma.j@example.com",
    phone: "+1 (555) 987-6543",
    guests: 1,
  },
  "b-3": {
    id: "b-3",
    name: "Michael Smith",
    date: "2025-04-15",
    status: "Confirmed",
    amount: 399.0,
    email: "mike.smith@example.com",
    phone: "+1 (555) 456-7890",
    guests: 4,
  },
  "b-4": {
    id: "b-4",
    name: "Sarah Williams",
    date: "2025-04-18",
    status: "Cancelled",
    amount: 199.99,
    email: "sarah.w@example.com",
    phone: "+1 (555) 321-6547",
    guests: 2,
  },
  "b-5": {
    id: "b-5",
    name: "James Brown",
    date: "2025-04-20",
    status: "Confirmed",
    amount: 299.5,
    email: "james.b@example.com",
    phone: "+1 (555) 789-0123",
    guests: 3,
  },
  "b-6": {
    id: "b-6",
    name: "Olivia Davis",
    date: "2025-04-22",
    status: "Confirmed",
    amount: 179.99,
    email: "olivia.d@example.com",
    phone: "+1 (555) 234-5678",
    guests: 2,
  },
  "b-7": {
    id: "b-7",
    name: "William Taylor",
    date: "2025-04-25",
    status: "Pending",
    amount: 225.0,
    email: "william.t@example.com",
    phone: "+1 (555) 876-5432",
    guests: 2,
  },
  "b-8": {
    id: "b-8",
    name: "Sophia Martinez",
    date: "2025-04-28",
    status: "Confirmed",
    amount: 275.5,
    email: "sophia.m@example.com",
    phone: "+1 (555) 345-6789",
    guests: 4,
  },
  "b-9": {
    id: "b-9",
    name: "Benjamin Anderson",
    date: "2025-05-01",
    status: "Cancelled",
    amount: 199.99,
    email: "ben.a@example.com",
    phone: "+1 (555) 654-3210",
    guests: 1,
  },
  "b-10": {
    id: "b-10",
    name: "Isabella Thomas",
    date: "2025-05-05",
    status: "Confirmed",
    amount: 349.5,
    email: "isabella.t@example.com",
    phone: "+1 (555) 987-1234",
    guests: 6,
  },
  "b-11": {
    id: "b-11",
    name: "Alexander Clark",
    date: "2025-05-08",
    status: "Pending",
    amount: 169.99,
    email: "alex.c@example.com",
    phone: "+1 (555) 246-8101",
    guests: 2,
  },
  "b-12": {
    id: "b-12",
    name: "Charlotte Lewis",
    date: "2025-05-10",
    status: "Confirmed",
    amount: 299.0,
    email: "charlotte.l@example.com",
    phone: "+1 (555) 369-2580",
    guests: 3,
  },
}

// Mock tour groups data
export const tourGroups: Record<string, TourGroup> = {
  "tg-1": {
    id: "tg-1",
    product_id: "4455",
    option_id: "opt-1",
    start_time: "09:00",
    end_time: "11:00",
    bookings: ["b-1", "b-2", "b-3", "b-4"],
  },
  "tg-2": {
    id: "tg-2",
    product_id: "4455",
    option_id: "opt-2",
    start_time: "13:00",
    end_time: "16:00",
    bookings: ["b-5", "b-6"],
  },
  "tg-3": {
    id: "tg-3",
    product_id: "4456",
    option_id: "opt-3",
    start_time: "12:00",
    end_time: "15:00",
    bookings: ["b-7", "b-8", "b-9"],
  },
  "tg-4": {
    id: "tg-4",
    product_id: "4456",
    option_id: "opt-4",
    start_time: "18:00",
    end_time: "22:00",
    bookings: ["b-10", "b-11", "b-12"],
  },
}

// Mock groups of tour groups data
export const groupsOfTourGroups: GroupOfTourGroups[] = [
  {
    id: "gtg-1",
    product_id: "4455",
    tour_groups: ["tg-1", "tg-2"],
  },
  {
    id: "gtg-2",
    product_id: "4456",
    tour_groups: ["tg-3", "tg-4"],
  },
]

// Fetch functions to simulate API calls

export const fetchProduct = (productId: string): Promise<Product> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products[productId])
    }, 300)
  })
}

export const fetchTourGroup = (tourGroupId: string): Promise<TourGroup> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(tourGroups[tourGroupId])
    }, 300)
  })
}

export const fetchBooking = (bookingId: string): Promise<Booking> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(bookings[bookingId])
    }, 200)
  })
}

// Fetch multiple items at once
export const fetchTourGroups = (
  tourGroupIds: string[],
): Promise<TourGroup[]> => {
  return Promise.all(tourGroupIds.map((id) => fetchTourGroup(id)))
}

export const fetchBookings = (bookingIds: string[]): Promise<Booking[]> => {
  return Promise.all(bookingIds.map((id) => fetchBooking(id)))
}

// Update functions to simulate API calls
export const updateTourGroupBookings = (
  tourGroupId: string,
  bookingIds: string[],
): Promise<TourGroup> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedTourGroup = {
        ...tourGroups[tourGroupId],
        bookings: bookingIds,
      }
      tourGroups[tourGroupId] = updatedTourGroup
      resolve(updatedTourGroup)
    }, 300)
  })
}
