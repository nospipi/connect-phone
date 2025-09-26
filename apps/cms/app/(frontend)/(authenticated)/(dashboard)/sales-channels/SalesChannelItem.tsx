// apps/cms/app/(frontend)/(authenticated)/(dashboard)/sales-channels/SalesChannelItem.tsx
import { ISalesChannel } from "@connect-phone/shared-types"
import { Badge } from "@/components/common/Badge"
import { Card } from "@/components/common/Card"
import Link from "next/link"

//----------------------------------------------------------------------

interface SalesChannelItemProps {
  channel: ISalesChannel
}

const SalesChannelItem = ({ channel }: SalesChannelItemProps) => {
  return (
    <Link href={`/sales-channels/${channel.id}`}>
      <Card className="flex cursor-pointer flex-col p-6 transition-shadow hover:bg-gray-50 hover:shadow-md dark:hover:bg-gray-800">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-50">
              {channel.name}
            </h3>
            <Badge
              className={`shrink-0 ${
                channel.isActive
                  ? "border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900 dark:text-green-100"
                  : "border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              }`}
            >
              {channel.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {channel.description ? (
            <p className="mt-2 line-clamp-2 text-sm text-gray-500">
              {channel.description}
            </p>
          ) : (
            <p className="mt-2 text-sm italic text-gray-400">
              No description provided
            </p>
          )}
        </div>
      </Card>
    </Link>
  )
}

export default SalesChannelItem
