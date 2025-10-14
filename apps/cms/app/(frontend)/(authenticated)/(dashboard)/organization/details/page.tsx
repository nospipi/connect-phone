// apps/cms/app/(frontend)/(authenticated)/(dashboard)/organization/details/page.tsx
import Link from "next/link"
import { getCurrentOrganization } from "@/app/(backend)/server_actions/organizations/getCurrentOrganization"
import { redirect } from "next/navigation"
import { updateOrganization } from "@/app/(backend)/server_actions/organizations/updateOrganization"
import UpdateOrganizationLogoUpload from "./UpdateOrganizationLogoUpload.client"
import { Currency } from "@connect-phone/shared-types"

async function refreshPageAction() {
  "use server"
  redirect("/organization/details")
}

const CURRENCIES = Object.values(Currency).map((currency) => ({
  value: currency,
  label: currency,
}))

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const { logoUrl } = await searchParams
  const organizationData = await getCurrentOrganization()

  let currentLogoUrl = logoUrl || organizationData?.logoUrl || ""
  if (logoUrl === "clear") {
    currentLogoUrl = ""
  }

  return (
    <form
      key={organizationData?.id}
      action={updateOrganization}
      className="relative flex h-full overflow-hidden"
    >
      <div className="flex h-full flex-1 flex-col gap-2 overflow-hidden">
        <div className="flex h-full w-full flex-1 overflow-auto">
          <div className="flex h-full w-full max-w-3xl flex-col gap-10 px-3 pb-2">
            <div className="flex flex-1 flex-col gap-6 px-1">
              <input type="hidden" name="id" value={organizationData?.id} />

              <input type="hidden" name="logoUrl" value={currentLogoUrl} />

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Organization Name *
                </label>
                <input
                  defaultValue={organizationData?.name}
                  autoFocus
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g., Acme Corporation"
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  required
                />
                <p className="mt-2 text-xs text-gray-500">
                  The official name of your organization
                </p>
              </div>

              <div>
                <label
                  htmlFor="mainCurrency"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Main Currency *
                </label>
                <select
                  defaultValue={organizationData?.mainCurrency || Currency.USD}
                  id="mainCurrency"
                  name="mainCurrency"
                  className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-gray-500">
                  The main currency for your organization
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Organization Logo
                </label>
                <div className="mt-2">
                  <UpdateOrganizationLogoUpload
                    currentLogoUrl={currentLogoUrl}
                    organizationId={organizationData?.id.toString()}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Optional: Upload a logo to represent your organization
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 border-t border-gray-200 p-5 dark:border-slate-800/50">
          <button
            formAction={refreshPageAction}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Update Organization
          </button>
        </div>
      </div>
    </form>
  )
}

export default Page
