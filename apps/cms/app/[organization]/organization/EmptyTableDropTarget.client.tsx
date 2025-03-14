"use client"

import { useEffect, useRef, useState } from "react"
import { TableRow, TableCell } from "@/components/Table"
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import {
  itemKey,
  isItemData,
  BookingForTable,
} from "./DraggableBookingsTable.client"

interface EmptyTableDropTargetProps {
  instanceId: symbol
  tourGroupId: string
  onDropFromAnotherGroup: (
    booking: BookingForTable,
    targetIndex: number,
    sourceTourGroupId: string,
  ) => void
}

export function EmptyTableDropTarget({
  instanceId,
  tourGroupId,
  onDropFromAnotherGroup,
}: EmptyTableDropTargetProps) {
  const dropTargetRef = useRef<HTMLTableRowElement>(null)
  const [isDropTarget, setIsDropTarget] = useState(false)

  useEffect(() => {
    const element = dropTargetRef.current
    if (!element) return

    // Create placeholder data
    const data = {
      [itemKey]: true,
      instanceId,
      tourGroupId,
      isEmptyTarget: true,
    }

    const cleanup = dropTargetForElements({
      element,
      canDrop({ source }) {
        // Only check if the source has the right format and same instanceId
        return isItemData(source.data) && source.data.instanceId === instanceId
      },
      getData: () => data,
      onDragEnter() {
        setIsDropTarget(true)
      },
      onDragLeave() {
        setIsDropTarget(false)
      },
      onDrop({ source }) {
        setIsDropTarget(false)
        const sourceData = source.data

        if (!isItemData(sourceData)) return

        if (sourceData.tourGroupId && sourceData.tourGroupId !== tourGroupId) {
          // Drop from another tour group into this empty one
          onDropFromAnotherGroup(
            sourceData.booking,
            0, // Always at index 0 since table is empty
            sourceData.tourGroupId,
          )

          console.log("Drop into empty tour group:", {
            booking: sourceData.booking,
            fromTourGroup: sourceData.tourGroupId,
            toTourGroup: tourGroupId,
          })
        }
      },
    })

    return cleanup
  }, [instanceId, tourGroupId, onDropFromAnotherGroup])

  return (
    <TableRow
      ref={dropTargetRef}
      className={`h-24 transition-colors duration-200 ${
        isDropTarget
          ? "bg-indigo-100 dark:bg-indigo-900/30"
          : "bg-gray-50 dark:bg-gray-900/20"
      }`}
    >
      <TableCell colSpan={5} className="text-center">
        <div className="flex flex-col items-center justify-center gap-2 py-8">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
              isDropTarget
                ? "border-dashed border-indigo-500 bg-indigo-100 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-900/30 dark:text-indigo-400"
                : "border-dashed border-gray-400 bg-gray-100 text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <p
            className={`text-sm font-medium ${
              isDropTarget
                ? "text-indigo-700 dark:text-indigo-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {isDropTarget ? "Drop booking here" : "Drop a booking here"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Drag a booking from another tour group to add it here
          </p>
        </div>
      </TableCell>
    </TableRow>
  )
}
