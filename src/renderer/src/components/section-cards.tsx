import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { JSX } from 'react'
import { DollarSign, Package, ShoppingCart, TrendingDown, TrendingUp, Users } from 'lucide-react'

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
  const getDelta = (value: number, fallback: number): number => (value === 0 ? 0 : fallback)

  const metrics = [
    {
      label: 'Total Sales',
      value: `Rs. ${totalSales.toLocaleString()}`,
      helper: 'Gross revenue',
      delta: getDelta(totalSales, 4.2),
      icon: DollarSign
    },
    {
      label: 'New Orders',
      value: newOrders.toLocaleString(),
      helper: 'Orders this week',
      delta: getDelta(newOrders, 2.4),
      icon: ShoppingCart
    },
    {
      label: 'Total Products',
      value: totalProducts.toLocaleString(),
      helper: 'Active catalog',
      delta: getDelta(totalProducts, 1.6),
      icon: Package
    },
    {
      label: 'Total Customers',
      value: totalCustomers.toLocaleString(),
      helper: 'Active customers',
      delta: getDelta(totalCustomers, 3.1),
      icon: Users
    }
  ]

  const renderDelta = (delta: number): JSX.Element => {
    if (delta === 0) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-1 text-xs font-medium text-muted-foreground">
          Steady
        </span>
      )
    }

    const isPositive = delta > 0
    const DeltaIcon = isPositive ? TrendingUp : TrendingDown
    const deltaText = `${isPositive ? '+' : '-'}${Math.abs(delta).toFixed(1)}%`

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
          isPositive ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
        }`}
      >
        <DeltaIcon className="h-3 w-3" />
        {deltaText}
      </span>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <Card
            key={metric.label}
            className="@container/card relative overflow-hidden border-border/80 bg-card/90 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.35)]"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
            <CardHeader className="gap-3 pb-4">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {metric.label}
                </CardDescription>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {metric.value}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex items-center justify-between pt-0 text-sm">
              <span className="text-xs text-muted-foreground">{metric.helper}</span>
              {renderDelta(metric.delta)}
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
