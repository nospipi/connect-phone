// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/calendar/[date_range_id]/page.tsx

import { getDateRangeById } from "@/app/(backend)/server_actions/date-ranges/getDateRangeById"
import { updateDateRange } from "@/app/(backend)/server_actions/date-ranges/updateDateRange"
import Link from "next/link"
import { RiArrowLeftLine } from "@remixicon/react"
import DeleteDateRangeButton from "./DeleteDateRangeButton"

//------------------------------------------------------------

const Page = async ({
  params,
}: {
  params: Promise<{ date_range_id: string }>
}) => {
  const { date_range_id } = await params
  const dateRangeData = await getDateRangeById(Number(date_range_id))

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <Link
          href="/inventory/calendar"
          className="flex h-full items-center justify-center px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-300"
        >
          <RiArrowLeftLine className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-4 py-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Edit Date Range
            </h1>
            <p className="text-sm text-gray-500">
              Update the date range information
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-hidden py-4">
        <div className="flex h-full w-full justify-center overflow-auto px-4">
          <div className="flex w-full max-w-3xl flex-col gap-10">
            <form
              action={updateDateRange}
              className="flex flex-1 flex-col gap-6"
            >
              <input type="hidden" name="id" value={dateRangeData.id} />

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-slate-300"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  autoFocus
                  type="text"
                  id="name"
                  name="name"
                  required
                  defaultValue={dateRangeData.name}
                  placeholder="e.g., Q1 2025, Summer Season, Holiday Period"
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-slate-700/50"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-slate-500">
                  Choose a descriptive name for your date range
                </p>
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
                  defaultValue={dateRangeData.startDate}
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:focus:border-slate-700/50"
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
                  defaultValue={dateRangeData.endDate}
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:focus:border-slate-700/50"
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end dark:border-gray-800">
                <Link
                  href="/inventory/calendar"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Update Date Range
                </button>
              </div>
            </form>

            <DeleteDateRangeButton dateRange={dateRangeData} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
