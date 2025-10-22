// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/offers/create-new/ExclusionsDrawer.tsx

import { RiCloseLine, RiAddLine, RiDeleteBin6Line } from "@remixicon/react"
import { getAllOfferExclusionsPaginated } from "@/app/(backend)/server_actions/offer-exclusions/getAllOfferExclusionsPaginated"
import { createOfferExclusion } from "@/app/(backend)/server_actions/offer-exclusions/createOfferExclusion"
import { deleteOfferExclusionById } from "@/app/(backend)/server_actions/offer-exclusions/deleteOfferExclusionById"
import { PendingOverlay } from "@/components/common/PendingOverlay"

//------------------------------------------------------------

const ManageExclusionsButton = async () => {
  const { items: exclusions } = await getAllOfferExclusionsPaginated({
    page: 1,
    limit: 100,
  })

  return (
    <>
      <input type="checkbox" id="exclusions-drawer" className="peer hidden" />

      <label
        htmlFor="exclusions-drawer"
        className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-700/50"
      >
        Manage Exclusions
      </label>

      <label
        htmlFor="exclusions-drawer"
        className="invisible fixed inset-0 z-40 bg-black/50 opacity-0 backdrop-blur-sm transition-all duration-300 peer-checked:visible peer-checked:opacity-100"
      />

      <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] translate-y-full transform overflow-hidden border-t border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-out peer-checked:translate-y-0 dark:border-gray-800 dark:bg-gray-950">
        <div className="flex h-full max-h-[85vh] flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Manage Exclusions
            </h3>
            <label
              htmlFor="exclusions-drawer"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-600 transition-colors duration-200 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <RiCloseLine className="h-5 w-5" />
            </label>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <div className="mb-4 space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                Add New Exclusion
              </label>
              <form action={createOfferExclusion} className="flex gap-2">
                <input
                  type="text"
                  name="body"
                  required
                  placeholder="Enter exclusion text..."
                  className="flex-1 border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder-slate-500"
                />
                <PendingOverlay mode="form">
                  <button
                    type="submit"
                    className="flex items-center gap-2 border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    <RiAddLine className="h-4 w-4" />
                    Add
                  </button>
                </PendingOverlay>
              </form>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                Current Exclusions
              </label>
              <div className="space-y-2">
                {exclusions.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-500 dark:text-slate-400">
                    No exclusions found
                  </p>
                ) : (
                  exclusions.map((exclusion) => (
                    <div
                      key={exclusion.id}
                      className="flex items-center justify-between gap-4 border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
                    >
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {exclusion.body}
                        </p>
                      </div>
                      <form action={deleteOfferExclusionById}>
                        <input
                          type="hidden"
                          name="offerExclusionId"
                          value={exclusion.id}
                        />
                        <PendingOverlay mode="form">
                          <button
                            type="submit"
                            className="flex h-8 w-8 items-center justify-center text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                          >
                            <RiDeleteBin6Line className="h-4 w-4" />
                          </button>
                        </PendingOverlay>
                      </form>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
            <label
              htmlFor="exclusions-drawer"
              className="flex w-full cursor-pointer items-center justify-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  )
}

export default ManageExclusionsButton
