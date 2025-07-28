"use client"

import { Booking, ProductOption, TourGroup } from "./types"
import { DraggableBookingsTable } from "./DraggableBookingsTable.client"
import {
  RiTimeLine,
  RiGroupLine,
  RiTicketLine,
  RiMoneyDollarCircleLine,
  RiFileListLine,
  RiStickyNoteLine,
  RiCarLine,
  RiUserLine,
  RiTaskLine,
  RiAddLine,
  RiEditLine,
} from "@remixicon/react"
import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"

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
  groupNumber?: number // Added for group number
}

export function TourGroupSection({
  tourGroup,
  productOption,
  onBookingMove,
  groupInstanceId,
  groupTourGroups,
  groupNumber = 1, // Default value
}: TourGroupSectionProps) {
  // Format time from 24hr to 12hr format with AM/PM
  const formatTime = (time: string | undefined) => {
    if (!time) return "-"

    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const formattedHours = hours % 12 || 12

    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  // Calculate total revenue (using booking amounts)
  const totalRevenue =
    tourGroup.bookingData?.reduce(
      (sum, booking) => sum + (booking.amount || 0),
      0,
    ) || 0

  // Mock data for the new features
  const filesCount = 5
  const vehicleName = "Van #103"

  // Mock data for assignees
  const assignees = [
    { id: "a1", name: "John Smith" },
    { id: "a2", name: "Emma Wilson" },
    { id: "a3", name: "Miguel Rodriguez" },
  ]

  // Mock data for task assignees
  const taskAssignees = [
    { id: "t1", name: "Sarah Johnson" },
    { id: "t2", name: "David Chen" },
  ]

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
      {/* Tour Group Header with Group Number and Revenue */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-sm">
            Group {groupNumber}
          </Badge>
          <h3 className="font-medium text-gray-900 dark:text-white">
            {formatTime(tourGroup.start_time)} -{" "}
            {formatTime(tourGroup.end_time)}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-500">
          <RiMoneyDollarCircleLine className="size-4" />$
          {totalRevenue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>

      {/* Original metadata row */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
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
        className="mb-4"
        showDragHeader={false}
        tourGroupId={tourGroup.id}
        groupInstanceId={groupInstanceId}
        groupTourGroups={groupTourGroups}
      />

      {/* Info and actions cards at the bottom - hover effects only on action buttons */}
      <div className="mt-4 flex flex-wrap gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
        {/* Files Card */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-700">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Files
            </div>
            <button
              onClick={() => console.log("Add files")}
              className="rounded-full p-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
              aria-label="Add files"
            >
              <RiAddLine className="size-3.5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2"
            onClick={() => console.log("Files clicked")}
          >
            <RiFileListLine className="size-4 text-indigo-500 dark:text-indigo-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {filesCount} files
            </span>
          </div>
        </div>

        {/* Vehicle Card */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-700">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Vehicle
            </div>
            <button
              onClick={() => console.log("Change vehicle")}
              className="rounded-full p-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
              aria-label="Change vehicle"
            >
              <RiEditLine className="size-3.5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-2"
            onClick={() => console.log("Vehicle clicked")}
          >
            <RiCarLine className="size-4 text-indigo-500 dark:text-indigo-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {vehicleName}
            </span>
          </div>
        </div>

        {/* Assignees Card */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-700">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Assignees
            </div>
            <button
              onClick={() => console.log("Edit assignees")}
              className="rounded-full p-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
              aria-label="Edit assignees"
            >
              <RiEditLine className="size-3.5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div
            className="flex items-start gap-2 px-3 py-2"
            onClick={() => console.log("Assignees clicked")}
          >
            <RiUserLine className="mt-0.5 size-4 flex-shrink-0 text-indigo-500 dark:text-indigo-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {assignees.map((a) => a.name).join(", ")}
            </span>
          </div>
        </div>

        {/* Tasks Card */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-700">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Tasks
            </div>
            <button
              onClick={() => console.log("Edit tasks")}
              className="rounded-full p-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
              aria-label="Edit tasks"
            >
              <RiEditLine className="size-3.5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div
            className="flex items-start gap-2 px-3 py-2"
            onClick={() => console.log("Tasks clicked")}
          >
            <RiTaskLine className="mt-0.5 size-4 flex-shrink-0 text-indigo-500 dark:text-indigo-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {taskAssignees.map((t) => t.name).join(", ")}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
