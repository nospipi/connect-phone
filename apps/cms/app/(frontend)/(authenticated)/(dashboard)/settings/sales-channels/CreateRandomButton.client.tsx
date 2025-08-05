"use client"

import { createARandomSalesChannel } from "@/app/(backend)/server_actions/createARandomSalesChannel"
import { Button } from "@/components/common/Button"
import { RiAddLine } from "@remixicon/react"

//--------------------------------------------------------------

const AddChannelButton = () => {
  return (
    <Button
      className="flex items-center gap-2"
      onClick={async () => {
        await createARandomSalesChannel()
      }}
    >
      <RiAddLine className="h-4 w-4" />
      Add Channel
    </Button>
  )
}
export default AddChannelButton
