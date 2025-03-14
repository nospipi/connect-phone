"use client"

import { useState } from "react"
import { GroupOfTourGroups, Booking, TourGroup } from "./types"
import { TourGroupSection } from "./TourGroupSection.client"

interface GroupOfTourGroupsCardProps {
  group: GroupOfTourGroups
  onReorderBookings: (
    sourceTourGroupId: string,
    targetTourGroupId: string,
    booking: Booking,
    targetIndex: number,
  ) => Promise<void>
}

export function GroupOfTourGroupsCard({
  group,
  onReorderBookings,
}: GroupOfTourGroupsCardProps) {
  // Create a shared instance ID for this group - this allows drag and drop between tour groups
  // in the same group of tour groups, but not between different groups of tour groups
  const [groupInstanceId] = useState(() => Symbol("group-instance-id"))

  // Handle moving a booking within this group of tour groups
  const handleBookingMove = async (
    sourceTourGroupId: string,
    targetTourGroupId: string,
    booking: any,
    targetIndex: number,
  ) => {
    await onReorderBookings(
      sourceTourGroupId,
      targetTourGroupId,
      booking,
      targetIndex,
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
      {/* Group Header */}
      <div className="border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {group.productData?.title || "Unnamed Product"}
              </h2>
              <div className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                {group.tourGroupData?.length || 0} tour groups
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {group.tourGroupData?.reduce(
                (total, tourGroup) =>
                  total + (tourGroup.bookingData?.length || 0),
                0,
              ) || 0}{" "}
              Bookings
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Product ID: {group.product_id}
            </div>
          </div>
        </div>
      </div>

      {/* Tour Groups */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {group.tourGroupData && group.tourGroupData.length > 0 ? (
          group.tourGroupData.map((tourGroup, index) => (
            <TourGroupSection
              key={tourGroup.id}
              tourGroup={tourGroup}
              productOption={group.productData?.options.find(
                (opt) => opt.id === tourGroup.option_id,
              )}
              onBookingMove={handleBookingMove}
              groupInstanceId={groupInstanceId}
              groupTourGroups={group.tourGroupData || []}
              groupNumber={index + 1} // Pass the group number (1-based index)
            />
          ))
        ) : (
          <div className="flex h-40 flex-col items-center justify-center p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <svg
                className="size-6 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              No tour groups found
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
