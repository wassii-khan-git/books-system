import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { JSX } from 'react'

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
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6">
      {/* Recent Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Customers</CardTitle>
          <CardDescription>The latest customers who joined.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {newCustomers.length > 0 ? (
            newCustomers.map((user, index) => (
              <div key={index} className="flex items-center space-x-4">
                <img
                  width={30}
                  height={30}
                  src={(user?.image as string) || '/placeholder.png'}
                  alt={user.name?.slice(0, 2).toUpperCase() as string}
                />

                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-center text-muted-foreground">
              No new customers this period.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>The latest orders placed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {newOrders.length > 0 ? (
            newOrders.map((order, index) => (
              <div key={index} className="flex items-center justify-between space-x-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Order #{order?.id.slice(-6)}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order?.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Rs. {order?.totalPrice.toLocaleString()}</p>
                  <p
                    className={`text-xs ${
                      order?.paymentStatus === 'Paid' ? 'text-green-500' : 'text-yellow-500'
                    }`}
                  >
                    {order?.paymentStatus}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-center text-muted-foreground">No new orders this period.</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Products */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Products</CardTitle>
          <CardDescription>The latest products added to your store.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {newProducts.length > 0 ? (
            newProducts.map((product, index) => (
              <div key={index} className="flex items-center space-x-4">
                <img
                  width={30}
                  height={30}
                  src={product?.images?.[0]?.url || '/placeholder.png'}
                  alt={product?.images?.[0]?.altText as string}
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{product?.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Rs. {product?.price?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-center text-muted-foreground">
              No new products this period.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
