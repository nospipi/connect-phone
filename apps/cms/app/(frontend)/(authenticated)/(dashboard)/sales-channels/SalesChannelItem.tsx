// apps/cms/app/(frontend)/(authenticated)/(dashboard)/sales-channels/SalesChannelItem.tsx
import { ISalesChannel } from "@connect-phone/shared-types"
import { Badge } from "@/components/common/Badge"
import Link from "next/link"

//----------------------------------------------------------------------

interface SalesChannelItemProps {
  channel: ISalesChannel
}

const SalesChannelItem = ({ channel }: SalesChannelItemProps) => {
  return (
    <Link href={`/sales-channels/${channel.id}`} className="block">
      <div className="duration-2000 group py-4 transition-all">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 group-hover:text-gray-700 dark:text-gray-50 dark:group-hover:text-gray-100">
                  {channel.name}
                </p>
                <p className="mt-1 truncate text-sm text-gray-600 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300">
                  {channel.description || "No description provided"}
                </p>
              </div>

              {/* Status Badge - positioned to far right */}
              <div className="ml-4 flex-shrink-0">
                <Badge variant={channel.isActive ? "success" : "error"}>
                  {channel.isActive ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default SalesChannelItem
