import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { JSX } from 'react'
import { Package, ShoppingCart, Users, type LucideIcon } from 'lucide-react'

type EmptyStateProps = {
  title: string
  description: string
  icon: LucideIcon
}

function EmptyState({ title, description, icon: Icon }: EmptyStateProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/40 px-6 py-8 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  )
}

// Section for recent activity cards
export default function RecentActivity({
  newCustomers,
  newOrders,
  newProducts
}: {
  newCustomers: []
  newOrders: []
  newProducts: []
}): JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Recent Customers */}
      <Card className="border-border/80 bg-card/90 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.35)]">
        <CardHeader className="flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">Recent Customers</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Latest signups
            </CardDescription>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users className="h-4 w-4" />
          </span>
        </CardHeader>
        <CardContent className="space-y-3">
          {newCustomers.length > 0 ? (
            newCustomers.map((user, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 px-3 py-2"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {user.name?.slice(0, 2).toUpperCase() as string}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="No new customers"
              description="New signups will appear here."
              icon={Users}
            />
          )}
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="border-border/80 bg-card/90 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.35)]">
        <CardHeader className="flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Latest orders placed
            </CardDescription>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShoppingCart className="h-4 w-4" />
          </span>
        </CardHeader>
        <CardContent className="space-y-3">
          {newOrders.length > 0 ? (
            newOrders.map((order, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/30 px-3 py-2"
              >
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Order #{order?.id.slice(-6)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order?.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">Rs. {order?.totalPrice.toLocaleString()}</p>
                  <span
                    className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      order?.paymentStatus === 'Paid'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200'
                    }`}
                  >
                    {order?.paymentStatus}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="No recent orders"
              description="Orders will show up once they are placed."
              icon={ShoppingCart}
            />
          )}
        </CardContent>
      </Card>

      {/* Recent Products */}
      <Card className="border-border/80 bg-card/90 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.35)]">
        <CardHeader className="flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">Recent Products</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Latest items added
            </CardDescription>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Package className="h-4 w-4" />
          </span>
        </CardHeader>
        <CardContent className="space-y-3">
          {newProducts.length > 0 ? (
            newProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 px-3 py-2"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Package className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{product?.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Rs. {product?.price?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="No new products"
              description="New catalog items will appear here."
              icon={Package}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
