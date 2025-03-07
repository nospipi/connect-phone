import LogoUpload from "./LogoUpload.client"

//--------------------------------------------

export default function CreateOrganizationPage() {
  return (
    <div className="h-screen w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900">
      <div className="mx-auto flex h-full w-full max-w-xl items-center justify-center py-8">
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="px-2 py-4">
            <div className="mb-8 flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Create New Organization
              </h1>
            </div>

            <form>
              <div className="grid grid-cols-1 gap-y-8">
                <LogoUpload />
                <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>

                <div>
                  <label
                    htmlFor="org-name"
                    className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Organization Name
                  </label>
                  <input
                    id="org-name"
                    name="name"
                    type="text"
                    placeholder="My Amazing Organization"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    This is how your organization will appear throughout the app
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="org-slug"
                    className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Organization Slug
                  </label>
                  <div className="flex items-center">
                    <span className="rounded-l-md border border-r-0 border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                      yourapp.com/
                    </span>
                    <input
                      id="org-slug"
                      name="slug"
                      type="text"
                      placeholder="my-organization"
                      className="block w-full min-w-0 flex-1 rounded-r-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    This will be used in URLs and cannot be changed later
                  </p>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    Create Organization
                  </button>
                  <p className="mt-3 text-center text-xs text-gray-500">
                    By creating an organization, you agree to our Terms of
                    Service and Privacy Policy
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
