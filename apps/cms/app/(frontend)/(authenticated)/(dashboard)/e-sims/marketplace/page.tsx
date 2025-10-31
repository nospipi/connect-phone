import { Card } from "@/components/common/Card"
import { Badge } from "@/components/common/Badge"
import { Button } from "@/components/common/Button"
import { RiShoppingCartLine } from "@remixicon/react"

// Placeholder data for marketplace e-sim offers
const marketplaceOffers = [
  {
    id: 1,
    title: "Global Data Plan",
    description: "Unlimited data in 100+ countries for 30 days",
    durationInDays: 30,
    dataInGb: null,
    isUnlimitedData: true,
    price: 29.99,
    countries: [
      "USA",
      "UK",
      "Germany",
      "France",
      "Italy",
      "Spain",
      "Japan",
      "Australia",
    ],
    provider: "GlobalConnect",
    rating: 4.8,
    reviews: 1247,
  },
  {
    id: 2,
    title: "Europe Explorer",
    description: "High-speed data across all European countries",
    durationInDays: 15,
    dataInGb: 10,
    isUnlimitedData: false,
    price: 19.99,
    countries: [
      "France",
      "Germany",
      "Italy",
      "Spain",
      "Netherlands",
      "Belgium",
      "Austria",
    ],
    provider: "EuroData",
    rating: 4.6,
    reviews: 892,
  },
  {
    id: 3,
    title: "Asia Connect",
    description: "Stay connected in major Asian destinations",
    durationInDays: 7,
    dataInGb: 5,
    isUnlimitedData: false,
    price: 14.99,
    countries: [
      "Japan",
      "South Korea",
      "Thailand",
      "Singapore",
      "Hong Kong",
      "Taiwan",
    ],
    provider: "AsiaLink",
    rating: 4.7,
    reviews: 654,
  },
  {
    id: 4,
    title: "Americas Roam",
    description: "Comprehensive coverage in North and South America",
    durationInDays: 30,
    dataInGb: 20,
    isUnlimitedData: false,
    price: 34.99,
    countries: [
      "USA",
      "Canada",
      "Mexico",
      "Brazil",
      "Argentina",
      "Chile",
      "Colombia",
    ],
    provider: "AmericasNet",
    rating: 4.5,
    reviews: 423,
  },
  {
    id: 5,
    title: "Weekend Warrior",
    description: "Perfect for short trips - 3 days of unlimited data",
    durationInDays: 3,
    dataInGb: null,
    isUnlimitedData: true,
    price: 9.99,
    countries: ["USA", "UK", "Germany", "France", "Italy", "Spain"],
    provider: "QuickConnect",
    rating: 4.4,
    reviews: 2156,
  },
  {
    id: 6,
    title: "Business Traveler",
    description: "Reliable connectivity for business trips worldwide",
    durationInDays: 14,
    dataInGb: 15,
    isUnlimitedData: false,
    price: 39.99,
    countries: [
      "USA",
      "UK",
      "Germany",
      "France",
      "Japan",
      "Singapore",
      "UAE",
      "Australia",
    ],
    provider: "BizConnect",
    rating: 4.9,
    reviews: 387,
  },
]

const Page = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Browse and purchase e-SIM cards for international travel.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {marketplaceOffers.map((offer) => (
          <Card key={offer.id} className="p-6">
            <div className="mb-4">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                  {offer.title}
                </h3>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ⭐ {offer.rating}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({offer.reviews})
                  </span>
                </div>
              </div>
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                {offer.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                by {offer.provider}
              </p>
            </div>

            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Duration:
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  {offer.durationInDays} days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Data:
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  {offer.isUnlimitedData ? "Unlimited" : `${offer.dataInGb} GB`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Price:
                </span>
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                  ${offer.price}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Countries ({offer.countries.length}):
              </span>
              <div className="mt-2 flex flex-wrap gap-1">
                {offer.countries.slice(0, 4).map((country) => (
                  <Badge key={country} variant="neutral" className="text-xs">
                    {country}
                  </Badge>
                ))}
                {offer.countries.length > 4 && (
                  <Badge variant="neutral" className="text-xs">
                    +{offer.countries.length - 4} more
                  </Badge>
                )}
              </div>
            </div>

            <Button className="flex w-full items-center justify-center gap-2">
              <RiShoppingCartLine className="h-4 w-4" />
              Purchase Now
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Page
