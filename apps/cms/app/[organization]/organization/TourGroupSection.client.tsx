"use client"

import { Booking, ProductOption, TourGroup } from "./types"
import { DraggableBookingsTable } from "./DraggableBookingsTable.client"
import { RiTimeLine, RiGroupLine, RiTicketLine } from "@remixicon/react"

interface TourGroupSectionProps {
  tourGroup: TourGroup
  productOption?: ProductOption
  onBookingMove: (
    sourceTourGroupId: string,
    targetTourGroupId: string,
    booking: any,
    targetIndex: number,
  ) => Promise<void>
  groupInstanceId: symbol
  groupTourGroups: TourGroup[]
}

export function TourGroupSection({
  tourGroup,
  productOption,
  onBookingMove,
  groupInstanceId,
  groupTourGroups,
}: TourGroupSectionProps) {
  // Format time from 24hr to 12hr format with AM/PM
  const formatTime = (time: string | undefined) => {
    if (!time) return "-"

    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const formattedHours = hours % 12 || 12

    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  // Handle when a booking is dragged within this tour group
  const handleReorderWithinGroup = (newBookings: any[]) => {
    // No change in tour group, just reorder
    const bookingIds = newBookings.map((booking) => booking.id)

    // Update the UI optimistically
    tourGroup.bookings = bookingIds
    tourGroup.bookingData = newBookings

    // No need to call parent handler for simple reordering within the same tour group
    console.log(`Reordered bookings within tour group ${tourGroup.id}`)
  }

  // Ensure bookingData is always initialized
  if (!tourGroup.bookingData) {
    tourGroup.bookingData = []
  }

  // Handle when a booking is dropped into this tour group from another tour group
  const handleDropFromOtherGroup = (
    booking: any,
    targetIndex: number,
    sourceTourGroupId: string,
  ) => {
    onBookingMove(sourceTourGroupId, tourGroup.id, booking, targetIndex)
  }

  return (
    <div className="p-4">
      {/* Tour Group Info - Metadata only */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <RiTimeLine className="size-4 text-gray-500 dark:text-gray-400" />
          <span>
            {formatTime(tourGroup.start_time)} -{" "}
            {formatTime(tourGroup.end_time)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <RiGroupLine className="size-4 text-gray-500 dark:text-gray-400" />
          <span>
            {tourGroup.bookingData?.reduce(
              (total, booking) => total + (booking.guests || 0),
              0,
            ) || 0}{" "}
            Guests
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <RiTicketLine className="size-4 text-gray-500 dark:text-gray-400" />
          <span>{tourGroup.bookingData?.length || 0} Bookings</span>
        </div>
        <div className="rounded-md bg-indigo-50 px-2.5 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400">
          {productOption?.title || "Standard Option"}
        </div>
      </div>

      {/* Bookings Table */}
      <DraggableBookingsTable
        bookings={(tourGroup.bookingData || []) as any}
        onReorder={handleReorderWithinGroup}
        onDropFromAnotherGroup={handleDropFromOtherGroup}
        className="mt-2"
        showDragHeader={false}
        tourGroupId={tourGroup.id}
        groupInstanceId={groupInstanceId}
        groupTourGroups={groupTourGroups}
      />
    </div>
  )
}
