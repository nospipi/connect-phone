"use client"

import { createARandomSalesChannel } from "@/app/server_actions"

const CreateRandomButton = () => {
  return (
    <button
      className="mb-4 mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      onClick={async () => {
        await createARandomSalesChannel()
      }}
    >
      Create Random Sales Channel
    </button>
  )
}
export default CreateRandomButton
