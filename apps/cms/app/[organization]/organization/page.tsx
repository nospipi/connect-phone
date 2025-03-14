"use client"

import { useState } from "react"
import { DraggableBookingsTable } from "./DraggableBookingsTable.client"
import { Badge } from "@/components/Badge"
import { RiTicketLine, RiArrowUpDownLine, RiAddLine } from "@remixicon/react"
import { Button } from "@/components/Button"

// Mock data
const initialBookings = [
  {
    id: "booking-1",
    name: "John Doe",
    date: "2025-04-10",
    status: "Confirmed",
    amount: 249.99,
  },
  {
    id: "booking-2",
    name: "Emma Johnson",
    date: "2025-04-12",
    status: "Pending",
    amount: 149.5,
  },
  {
    id: "booking-3",
    name: "Michael Smith",
    date: "2025-04-15",
    status: "Confirmed",
    amount: 399.0,
  },
  {
    id: "booking-4",
    name: "Sarah Williams",
    date: "2025-04-18",
    status: "Cancelled",
    amount: 199.99,
  },
  {
    id: "booking-5",
    name: "James Brown",
    date: "2025-04-20",
    status: "Confirmed",
    amount: 299.5,
  },
]

export default function BookingsPage() {
  const [bookings, setBookings] = useState(initialBookings)
  const [reorderCount, setReorderCount] = useState(0)

  // Handle reordering of bookings
  const handleReorder = (newBookings: any[]) => {
    setBookings(newBookings)
    setReorderCount((prev) => prev + 1)
    console.log("Bookings reordered:", newBookings)
  }

  return (
    <div className="h-screen overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Bookings
            </h1>
            <Badge variant="neutral" className="mt-1">
              {bookings.length} total
            </Badge>
          </div>
          <Button variant="primary" className="hidden gap-2 sm:flex">
            <RiAddLine className="size-4" />
            New Booking
          </Button>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View and manage your bookings. Drag rows to change priority order.
        </p>
      </div>

      {/* Reorder count notification */}
      {reorderCount > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-md bg-indigo-50 p-3 text-sm text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400">
          <RiArrowUpDownLine className="size-5 flex-shrink-0" />
          <span>
            Bookings have been reordered <strong>{reorderCount}</strong>{" "}
            {reorderCount === 1 ? "time" : "times"}
          </span>
        </div>
      )}

      {bookings.length > 0 ? (
        <DraggableBookingsTable
          bookings={bookings}
          onReorder={handleReorder}
          className="shadow-sm"
        />
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 dark:border-gray-700">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
            <RiTicketLine className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No bookings
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating a new booking.
          </p>
          <Button variant="primary" className="mt-4 gap-2">
            <RiAddLine className="size-4" />
            New Booking
          </Button>
        </div>
      )}
    </div>
  )
}
