// apps/cms/app/(frontend)/(authenticated)/(dashboard)/sales-channels/SalesChannelItem.tsx
import { ISalesChannel } from "@connect-phone/shared-types"
import { Badge } from "@/components/common/Badge"
import { ImageOff } from "lucide-react"
import Image from "next/image"
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
              <div className="flex items-start gap-3">
                {/* Logo or Fallback Icon */}
                <div className="flex-shrink-0">
                  {channel.logoUrl ? (
                    <div className="h-11 w-11 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-900">
                      <Image
                        src={channel.logoUrl}
                        alt={`${channel.name} logo`}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-900">
                      <ImageOff
                        className="text-gray-400 dark:text-gray-500"
                        size={16}
                      />
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 group-hover:text-gray-700 dark:text-gray-50 dark:group-hover:text-gray-100">
                    {channel.name}
                  </p>
                  <p className="mt-1 truncate text-sm text-gray-600 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300">
                    {channel.description || "No description provided"}
                  </p>
                </div>
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
