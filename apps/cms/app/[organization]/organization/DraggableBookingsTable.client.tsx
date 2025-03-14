"use client"

import { Button } from "@/components/Button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/Table"
import { cx, focusRing } from "@/lib/utils"
import { RiDraggable, RiArrowUpDownLine } from "@remixicon/react"
import { useEffect, useRef, useState } from "react"

// Import Atlaskit drag and drop libraries
import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash"
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index"
import * as liveRegion from "@atlaskit/pragmatic-drag-and-drop-live-region"
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box"
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine"
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview"
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview"
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder"

// Booking type definition
interface Booking {
  id: string
  name: string
  date?: string
  status?: string
  amount?: number
}

// Props for the component
interface DraggableBookingsTableProps {
  bookings: Booking[]
  onReorder?: (bookings: Booking[]) => void
  className?: string
}

// Symbol for item data identification
const itemKey = Symbol("item")

// Type definition for item data during drag and drop
type ItemData = {
  [itemKey]: true
  booking: Booking
  index: number
  instanceId: symbol
}

function getItemData({
  booking,
  index,
  instanceId,
}: {
  booking: Booking
  index: number
  instanceId: symbol
}): ItemData {
  return {
    [itemKey]: true,
    booking,
    index,
    instanceId,
  }
}

function isItemData(data: Record<string | symbol, unknown>): data is ItemData {
  return data[itemKey] === true
}

type DraggableState =
  | { type: "idle" }
  | { type: "preview"; container: HTMLElement }
  | { type: "dragging" }

// Idle and dragging state constants
const idleState: DraggableState = { type: "idle" }
const draggingState: DraggableState = { type: "dragging" }

export function DraggableBookingsTable({
  bookings: initialBookings,
  onReorder,
  className,
}: DraggableBookingsTableProps) {
  // State for bookings and drag-related information
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [closestEdgeMap, setClosestEdgeMap] = useState<
    Map<string, Edge | null>
  >(new Map())
  const [lastBookingMoved, setLastBookingMoved] = useState<{
    booking: Booking
    previousIndex: number
    currentIndex: number
  } | null>(null)

  // Instance ID to isolate drag and drop context
  const instanceId = useRef(Symbol("instance-id")).current

  // Registry to keep track of row elements
  const rowRegistry = useRef(new Map<string, HTMLTableRowElement>()).current

  // Function to register a row element
  const registerRow = (id: string, element: HTMLTableRowElement) => {
    rowRegistry.set(id, element)
    return () => {
      rowRegistry.delete(id)
    }
  }

  // Update bookings when initialBookings changes
  useEffect(() => {
    setBookings(initialBookings)
  }, [initialBookings])

  // Function to reorder items
  const reorderItem = ({
    startIndex,
    indexOfTarget,
    closestEdgeOfTarget,
  }: {
    startIndex: number
    indexOfTarget: number
    closestEdgeOfTarget: Edge | null
  }) => {
    const finishIndex = getReorderDestinationIndex({
      startIndex,
      indexOfTarget,
      closestEdgeOfTarget,
      axis: "vertical",
    })

    if (finishIndex === startIndex) {
      return
    }

    const newBookings = reorder({
      list: bookings,
      startIndex,
      finishIndex,
    })

    setBookings(newBookings)
    setLastBookingMoved({
      booking: bookings[startIndex],
      previousIndex: startIndex,
      currentIndex: finishIndex,
    })

    // Call onReorder callback if provided
    if (onReorder) {
      onReorder(newBookings)
    }
  }

  // Set up drop monitoring
  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return isItemData(source.data) && source.data.instanceId === instanceId
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0]
        if (!target) {
          console.log("No drop target found")
          return
        }

        const sourceData = source.data
        const targetData = target.data
        if (!isItemData(sourceData) || !isItemData(targetData)) {
          console.log("Invalid source or target data")
          return
        }

        const indexOfTarget = bookings.findIndex(
          (booking) => booking.id === targetData.booking.id,
        )
        if (indexOfTarget < 0) {
          console.log("Target index not found")
          return
        }

        const closestEdgeOfTarget = extractClosestEdge(targetData)

        reorderItem({
          startIndex: sourceData.index,
          indexOfTarget,
          closestEdgeOfTarget,
        })

        // Log the reordering event
        console.log("Booking reordered:", {
          booking: sourceData.booking,
          from: sourceData.index,
          to: indexOfTarget,
          edge: closestEdgeOfTarget,
        })
      },
    })
  }, [bookings, instanceId])

  // Handle post-drop actions for visual feedback
  useEffect(() => {
    if (lastBookingMoved === null) {
      return
    }

    const { booking } = lastBookingMoved
    const element = rowRegistry.get(booking.id)
    if (element) {
      triggerPostMoveFlash(element)
    }

    // Announce the move for accessibility
    liveRegion.announce(
      `Moved ${booking.name} from position ${lastBookingMoved.previousIndex + 1} to position ${
        lastBookingMoved.currentIndex + 1
      } of ${bookings.length}.`,
    )
  }, [lastBookingMoved, rowRegistry, bookings.length])

  // Clean up liveRegion when component unmounts
  useEffect(() => {
    return function cleanup() {
      liveRegion.cleanup()
    }
  }, [])

  // Set closest edge for a row
  const setClosestEdge = (id: string, edge: Edge | null) => {
    setClosestEdgeMap((prev) => {
      const newMap = new Map(prev)
      newMap.set(id, edge)
      return newMap
    })
  }

  return (
    <div
      className={cx(
        "w-full overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      {/* Table header with drag instructions */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <RiArrowUpDownLine className="size-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Drag to reorder bookings
          </span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell className="w-12 px-2">&nbsp;</TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell className="text-right">Amount</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking, index) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                index={index}
                instanceId={instanceId}
                registerRow={registerRow}
                setClosestEdge={setClosestEdge}
                closestEdge={closestEdgeMap.get(booking.id) || null}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

interface BookingRowProps {
  booking: Booking
  index: number
  instanceId: symbol
  registerRow: (id: string, element: HTMLTableRowElement) => () => void
  setClosestEdge: (id: string, edge: Edge | null) => void
  closestEdge: Edge | null
}

function BookingRow({
  booking,
  index,
  instanceId,
  registerRow,
  setClosestEdge,
  closestEdge,
}: BookingRowProps) {
  const rowRef = useRef<HTMLTableRowElement>(null)
  const dragHandleRef = useRef<HTMLButtonElement>(null)
  const [draggableState, setDraggableState] =
    useState<DraggableState>(idleState)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const element = rowRef.current
    const dragHandle = dragHandleRef.current

    if (!element || !dragHandle) return

    const data = getItemData({ booking, index, instanceId })

    const cleanup = combine(
      // Register the row element
      registerRow(booking.id, element),

      // Make the row draggable
      draggable({
        element: dragHandle,
        getInitialData: () => data,
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({
              x: "10px",
              y: "10px",
            }),
            render({ container }) {
              // Create a more visually appealing drag preview
              const previewElement = document.createElement("div")
              previewElement.className =
                "flex items-center gap-2 rounded-md bg-white dark:bg-gray-800 p-2 shadow-lg border border-gray-200 dark:border-gray-700"

              // Add an icon
              const icon = document.createElement("span")
              icon.className =
                "flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30"
              icon.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600 dark:text-indigo-400"><path d="M12 5v14M5 12h14"></path></svg>`

              // Add text
              const text = document.createElement("span")
              text.textContent = booking.name
              text.className =
                "font-medium text-sm text-gray-900 dark:text-white"

              previewElement.appendChild(icon)
              previewElement.appendChild(text)
              container.appendChild(previewElement)

              setDraggableState({ type: "preview", container })
              return () => setDraggableState(draggingState)
            },
          })
        },
        onDragStart() {
          setDraggableState(draggingState)
        },
        onDrop() {
          setDraggableState(idleState)
        },
      }),

      // Make the row a drop target
      dropTargetForElements({
        element,
        canDrop({ source }) {
          return (
            isItemData(source.data) && source.data.instanceId === instanceId
          )
        },
        getData({ input }) {
          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ["top", "bottom"],
          })
        },
        onDrag({ self, source }) {
          // If this is the source element, don't show an edge
          const isSource = source.element === element
          if (isSource) {
            setClosestEdge(booking.id, null)
            return
          }

          const closestEdge = extractClosestEdge(self.data)
          const sourceIndex = source.data.index

          if (typeof sourceIndex !== "number") return

          // Hide drop indicator in some cases
          const isItemBeforeSource = index === sourceIndex - 1
          const isItemAfterSource = index === sourceIndex + 1

          const isDropIndicatorHidden =
            (isItemBeforeSource && closestEdge === "bottom") ||
            (isItemAfterSource && closestEdge === "top")

          if (isDropIndicatorHidden) {
            setClosestEdge(booking.id, null)
            return
          }

          setClosestEdge(booking.id, closestEdge)
        },
        onDragLeave() {
          setClosestEdge(booking.id, null)
        },
        onDrop() {
          setClosestEdge(booking.id, null)
        },
      }),
    )

    return cleanup
  }, [booking, index, instanceId, registerRow, setClosestEdge])

  // Format amount if present
  const formattedAmount = booking.amount
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(booking.amount)
    : "-"

  // Format date if present
  const formattedDate = booking.date
    ? new Date(booking.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "-"

  return (
    <TableRow
      ref={rowRef}
      className={cx(
        "relative transition-colors duration-200",
        isHovered &&
          draggableState.type === "idle" &&
          "bg-gray-50 dark:bg-gray-900/50",
        draggableState.type === "dragging" &&
          "bg-indigo-50/50 dark:bg-indigo-900/10",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TableCell className="w-12 px-2">
        <Button
          ref={dragHandleRef}
          variant="ghost"
          className={cx(
            "-mx-1 cursor-grab px-1 py-1 transition-all duration-200 active:cursor-grabbing",
            isHovered && "text-indigo-600 dark:text-indigo-400",
            draggableState.type === "dragging" &&
              "scale-110 !text-indigo-600 dark:!text-indigo-400",
          )}
          aria-label={`Reorder ${booking.name}`}
        >
          <RiDraggable
            className={cx(
              "size-5 transition-transform duration-200",
              isHovered && "scale-110",
              draggableState.type === "dragging" && "scale-125",
            )}
          />
        </Button>
      </TableCell>
      <TableCell className="font-medium">{booking.name}</TableCell>
      <TableCell>{formattedDate}</TableCell>
      <TableCell>
        {booking.status && (
          <span
            className={cx(
              "inline-flex rounded-full px-2 py-1 text-xs font-medium",
              booking.status === "Confirmed" &&
                "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
              booking.status === "Pending" &&
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
              booking.status === "Cancelled" &&
                "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
            )}
          >
            {booking.status}
          </span>
        )}
      </TableCell>
      <TableCell className="text-right font-medium">
        {formattedAmount}
      </TableCell>

      {/* Drop indicator */}
      {closestEdge && (
        <div className="absolute left-0 right-0 z-10">
          <DropIndicator edge={closestEdge} gap="2px" />
        </div>
      )}
      {/* Hover indicator for the entire row */}
      {isHovered && draggableState.type === "idle" && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-50/20 to-transparent dark:from-indigo-900/10 dark:to-transparent" />
      )}

      {/* Active dragging indicator */}
      {draggableState.type === "dragging" && (
        <div className="pointer-events-none absolute inset-0 rounded-sm border border-indigo-200 dark:border-indigo-900/50" />
      )}
    </TableRow>
  )
}
