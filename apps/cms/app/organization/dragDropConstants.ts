// Symbol for item data identification to be shared across drag-drop components
export const itemKey = Symbol("drag-item")

// Helper function to check if data is valid item data
export function isItemData(data: Record<string | symbol, unknown>): boolean {
  return data[itemKey] === true
}

// BookingForTable type definition to be shared
export interface BookingForTable {
  id: string
  name: string
  date: string
  status: "Confirmed" | "Pending" | "Cancelled"
  amount: number
  email?: string
  phone?: string
  guests?: number
}
