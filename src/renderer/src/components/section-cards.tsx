import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { JSX } from 'react'

// Inline SVG for trending icons
const TrendingUpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4"
  >
    <path d="M17 7L12 2L7 7M12 2V22" />
  </svg>
)

const TrendingDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4"
  >
    <path d="M17 17L12 22L7 17M12 22V2" />
  </svg>
)

// Props for the SectionCards component
interface SectionCardsProps {
  totalSales: number
  newOrders: number
  totalProducts: number
  totalCustomers: number
}

export default function SectionCards({
  totalSales,
  newOrders,
  totalProducts,
  totalCustomers
}: SectionCardsProps): JSX.Element {
  // format percentage function

  const trendIcon = (value: number): JSX.Element =>
    value >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />
  const trendText = (value: number): string => (value >= 0 ? 'Trending up' : 'Trending down')

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Sales Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Sales</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rs. {totalSales.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {trendText(0)} this period
            {trendIcon(0)}
          </div>
          <div className="text-muted-foreground">Revenue generated over time</div>
        </CardFooter>
      </Card>

      {/* New Orders Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {newOrders.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {newOrders >= 0 ? 'Increase' : 'Decrease'} in new orders
            {trendIcon(0)}
          </div>
          <div className="text-muted-foreground">Performance of recent orders</div>
        </CardFooter>
      </Card>

      {/* Total Products Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Products</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalProducts.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Catalog size
            {trendIcon(0)}
          </div>
          <div className="text-muted-foreground">Total number of items in stock</div>
        </CardFooter>
      </Card>

      {/* Total Customers Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalCustomers.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Customer base growth
            {trendIcon(0)}
          </div>
          <div className="text-muted-foreground">Total registered users</div>
        </CardFooter>
      </Card>
    </div>
  )
}
