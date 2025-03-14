"use client"

import { useEffect, useState } from "react"
import { GroupOfTourGroups, Booking } from "./types"
import {
  fetchProduct,
  fetchTourGroups,
  fetchBookings,
  updateTourGroupBookings,
  groupsOfTourGroups as initialGroupsData,
} from "./mockData"
import { RiCalendarLine, RiAddLine, RiRefreshLine } from "@remixicon/react"
import { GroupOfTourGroupsCard } from "./GroupOfTourGroupsCard.client"

export default function GroupedToursPage() {
  const [groupsOfTourGroups, setGroupsOfTourGroups] = useState<
    GroupOfTourGroups[]
  >([])
  const [loading, setLoading] = useState(true)

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      try {
        // Start with our initial groups data
        const groupsWithData = await Promise.all(
          initialGroupsData.map(async (group) => {
            // Fetch product data for each group
            const productData = await fetchProduct(group.product_id)

            // Fetch tour groups data
            const tourGroupData = await fetchTourGroups(group.tour_groups)

            // For each tour group, fetch its bookings data
            const tourGroupsWithBookings = await Promise.all(
              tourGroupData.map(async (tourGroup) => {
                const bookingData = await fetchBookings(tourGroup.bookings)
                return { ...tourGroup, bookingData }
              }),
            )

            return {
              ...group,
              productData,
              tourGroupData: tourGroupsWithBookings,
            }
          }),
        )

        setGroupsOfTourGroups(groupsWithData)
      } catch (error) {
        console.error("Error fetching initial data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  // Handle moving a booking between tour groups
  const handleMoveBooking = async (
    sourceTourGroupId: string,
    targetTourGroupId: string,
    booking: Booking,
    targetIndex: number,
  ) => {
    try {
      // Find the groups containing the source and target tour groups
      const sourceGroupIndex = groupsOfTourGroups.findIndex((group) =>
        group.tourGroupData?.some((tg) => tg.id === sourceTourGroupId),
      )

      const targetGroupIndex = groupsOfTourGroups.findIndex((group) =>
        group.tourGroupData?.some((tg) => tg.id === targetTourGroupId),
      )

      if (sourceGroupIndex === -1 || targetGroupIndex === -1) return

      // Make sure the operation is within the same group of tour groups
      if (sourceGroupIndex !== targetGroupIndex) {
        console.error(
          "Cannot move bookings between different groups of tour groups",
        )
        return
      }

      // Find the source and target tour groups
      const sourceTourGroupIndex = groupsOfTourGroups[
        sourceGroupIndex
      ].tourGroupData?.findIndex((tg) => tg.id === sourceTourGroupId)

      const targetTourGroupIndex = groupsOfTourGroups[
        sourceGroupIndex
      ].tourGroupData?.findIndex((tg) => tg.id === targetTourGroupId)

      if (
        sourceTourGroupIndex === undefined ||
        sourceTourGroupIndex === -1 ||
        targetTourGroupIndex === undefined ||
        targetTourGroupIndex === -1
      )
        return

      // Get the source and target tour groups
      const sourceTourGroup =
        groupsOfTourGroups[sourceGroupIndex].tourGroupData?.[
          sourceTourGroupIndex
        ]
      const targetTourGroup =
        groupsOfTourGroups[sourceGroupIndex].tourGroupData?.[
          targetTourGroupIndex
        ]

      if (!sourceTourGroup || !targetTourGroup) return

      // Get the source booking data and index
      const sourceBookingIndex = sourceTourGroup.bookingData?.findIndex(
        (b) => b.id === booking.id,
      )
      if (sourceBookingIndex === undefined || sourceBookingIndex === -1) return

      // Remove the booking from the source tour group
      const updatedSourceBookings = [...(sourceTourGroup.bookings || [])]
      updatedSourceBookings.splice(sourceBookingIndex, 1)

      // Add the booking to the target tour group at the specified index
      const updatedTargetBookings = [...(targetTourGroup.bookings || [])]
      updatedTargetBookings.splice(targetIndex, 0, booking.id)

      // Update the tour groups' bookings in the mock API
      await Promise.all([
        updateTourGroupBookings(sourceTourGroupId, updatedSourceBookings),
        updateTourGroupBookings(targetTourGroupId, updatedTargetBookings),
      ])

      // Update local state
      const updatedGroups = [...groupsOfTourGroups]
      const updatedSourceTourGroup = {
        ...sourceTourGroup,
        bookings: updatedSourceBookings,
      }

      if (updatedSourceTourGroup.bookingData) {
        updatedSourceTourGroup.bookingData =
          updatedSourceTourGroup.bookingData.filter((b) => b.id !== booking.id)
      }

      const updatedTargetTourGroup = {
        ...targetTourGroup,
        bookings: updatedTargetBookings,
      }

      if (updatedTargetTourGroup.bookingData && sourceTourGroup.bookingData) {
        const targetBookingData = [...updatedTargetTourGroup.bookingData]
        const bookingToMove = sourceTourGroup.bookingData[sourceBookingIndex]
        targetBookingData.splice(targetIndex, 0, bookingToMove)
        updatedTargetTourGroup.bookingData = targetBookingData
      }

      // Update the tour groups in the state
      updatedGroups[sourceGroupIndex].tourGroupData![sourceTourGroupIndex] =
        updatedSourceTourGroup
      updatedGroups[sourceGroupIndex].tourGroupData![targetTourGroupIndex] =
        updatedTargetTourGroup

      setGroupsOfTourGroups(updatedGroups)

      console.log(
        `Moved booking ${booking.id} from tour group ${sourceTourGroupId} to ${targetTourGroupId}`,
      )
    } catch (error) {
      console.error("Error moving booking between tour groups:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-gray-700 dark:text-gray-300">
            Loading tour groups...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              onClick={() => console.log("Refreshing data...")}
            >
              <RiRefreshLine className="size-4" />
              Refresh
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700">
              <RiAddLine className="size-4" />
              New Group
            </button>
          </div>
        </div>
      </div>

      {groupsOfTourGroups.length > 0 ? (
        <div className="space-y-8">
          {groupsOfTourGroups.map((group) => (
            <GroupOfTourGroupsCard
              key={group.id}
              group={group}
              onReorderBookings={handleMoveBooking}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 dark:border-gray-700">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
            <RiCalendarLine className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No tour groups
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating a new tour group.
          </p>
          <button className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700">
            <RiAddLine className="size-4" />
            New Tour Group
          </button>
        </div>
      )}
    </div>
  )
}
