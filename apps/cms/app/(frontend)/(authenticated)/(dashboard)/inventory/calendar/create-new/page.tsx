// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/calendar/create-new/page.tsx

import { createDateRange } from "@/app/(backend)/server_actions/date-ranges/createDateRange"
import { Button } from "@/components/common/Button"
import Link from "next/link"
import { RiArrowLeftLine } from "@remixicon/react"

//------------------------------------------------------------

const Page = () => {
  return (
    <div className="flex h-full flex-col gap-6 overflow-auto py-4 pl-5 pr-5">
      <div className="flex items-center gap-4">
        <Link href="/inventory/calendar">
          <Button
            variant="secondary"
            className="gap-2 border-gray-300 bg-gray-50 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
          >
            <RiArrowLeftLine className="h-4 w-4" />
            <span>Back to Calendar</span>
          </Button>
        </Link>
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-200">
            Create New Date Range
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-500">
            Add a new date range to your calendar
          </p>
        </div>

        <form action={createDateRange} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="e.g., Q1 2025, Summer Season, Holiday Period"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none focus:border-blue-500 focus:ring-0 focus:ring-transparent dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-slate-700/50"
            />
          </div>

          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-0 focus:ring-transparent dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:focus:border-slate-700/50"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300"
            >
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-0 focus:ring-transparent dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:focus:border-slate-700/50"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Link href="/inventory/calendar">
              <Button
                variant="secondary"
                className="border-gray-300 bg-gray-50 px-4 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600/50 dark:hover:bg-slate-700/50"
              >
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" className="px-6">
              Create Date Range
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Page
