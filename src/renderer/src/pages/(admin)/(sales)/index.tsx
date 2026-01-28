// src/app/dashboard/sales/page.tsx
'use client'

import React, { JSX, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Plus, Minus, ShoppingCart, X, Check, Calculator } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useQuery } from '@tanstack/react-query'
import { ResponseTypes } from 'src/main/types'
import useDebounce from '@/hooks/use-debounce'
import { CartItem, useCartStore } from '@/store/cart.slice'
import { ProductTypes } from '../(products)/columns'
import { toast } from 'sonner'
import InvoiceDialog from './dialog'

// Sales Page
const SalesPage = (): JSX.Element => {
  // search
  const [value, setValue] = useState<string>('')

  // open
  const [open, setOpen] = useState<boolean>(false)

  // debounce search
  const { debounceValue } = useDebounce({ value, delay: 500 })

  // cart items
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCartStore()

  // Fetch all products
  const { data: products, isLoading: isSearching } = useQuery({
    queryKey: ['all-products', debounceValue],
    queryFn: async () => {
      const result: ResponseTypes = await window.api?.getProducts({
        page: 1,
        limit: 1000,
        searchTerm: debounceValue
      })
      return result
    },
    enabled: debounceValue.length > 0
  })

  const [discountPercent, setDiscountPercent] = useState<number>(0)

  //  invoice data
  const [invoiceData, setInvoiceData] = useState<any>({})

  // 1. Calculate Subtotal (Sum of all items)
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.subtotal, 0)
  }, [cartItems])

  // 2. Calculate Discount Amount in Rupees
  const discountAmount = useMemo(() => {
    return (subtotal * discountPercent) / 100
  }, [subtotal, discountPercent])

  // 3. Calculate Final Total
  const finalTotal = subtotal - discountAmount

  // clear
  const handleClear = (): void => {
    toast.success('Cart cleared')
    setValue('')
    clearCart()
  }

  // handle add to cart
  const handleAddToCart = (product: ProductTypes): void => {
    addToCart(product)
    setValue('')
    toast.success('Product added to cart')
  }

  // handle remove from cart
  const handleRemoveFromCart = (productId: string): void => {
    removeFromCart(productId)
    setValue('')
    toast.success('Product removed from cart')
  }

  useEffect(() => {
    setInvoiceData({
      items: cartItems,
      totals: {
        subtotal: subtotal,
        discountAmount: discountAmount,
        total: finalTotal,
        discount: discountPercent
      }
    })
  }, [cartItems, subtotal, discountAmount, finalTotal, discountPercent])

  console.log('cart itesms---', cartItems)

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sales</h1>
            <p className="text-sm text-muted-foreground">Quick and efficient book sales</p>
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={handleClear}
          disabled={cartItems.length === 0}
          size="sm"
        >
          <X className="mr-2 h-4 w-4" />
          Clear All
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Section - Search & Cart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Section */}
          <Card className="border-muted">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Search Books</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, author, or ISBN..."
                  className="pl-9 h-11"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  autoFocus
                />
                {isSearching && (
                  <div className="absolute right-3 top-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                )}
              </div>

              {/* Search Results */}
              {products?.data?.length > 0 && (
                <div className="max-h-96 overflow-y-auto rounded-lg border bg-card">
                  {products?.data?.map((product) => (
                    <div
                      key={product.id}
                      className={`flex items-center justify-between border-b p-4 last:border-b-0 cursor-pointer transition-all ${'bg-primary/5 border-l-4 border-l-primary'}`}
                      onClick={() => handleAddToCart(product)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base truncate">{product.title}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{product.author}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="text-xs font-normal">{product.company?.name}</Badge>
                          {product.off > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {product.off}% OFF
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xl font-bold text-primary">Rs. {product.price}</p>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <p className="text-xs text-muted-foreground line-through">
                            Rs. {product.originalPrice}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {products?.data?.length === 0 && (
                <div className="p-8 text-center border rounded-lg bg-muted/30">
                  <Search className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-muted-foreground font-medium">No books found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try searching with different keywords
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Professional Cart Table */}
          <Card className="shadow-sm overflow-hidden border-none ring-1 ring-slate-200">
            <Table>
              <TableHeader className="bg-slate-100/50">
                <TableRow>
                  <TableHead className="md:w-[20%]">Item</TableHead>
                  <TableHead className="md:w-[20%]">Company</TableHead>
                  <TableHead className="md:w-[20%]">Category</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <ShoppingCart className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                      <p className="text-slate-500 font-medium">Your cart is empty</p>
                      <p className="text-xs text-slate-400">
                        Search for products to start the sale
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <p className="font-medium line-clamp-1">{item?.title}</p>
                        <p className="text-xs text-muted-foreground">{item?.author}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className="text-xs font-normal">{item?.company?.name}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-600 text-white hover:bg-emerald-600 text-xs font-normal">
                          {item?.category?.title}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">Rs. {item.price}</TableCell>

                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Right Section - Summary */}
        <div className="space-y-6">
          <Card className="border-primary/20 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-semibold text-lg">Rs. {subtotal.toLocaleString()}</span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="additional-discount" className="text-sm font-medium">
                    Additional Discount (%)
                  </Label>
                  <Input
                    value={discountPercent}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      if (val >= 0 && val <= 100) setDiscountPercent(val)
                    }}
                    id="additional-discount"
                    type="number"
                    className="h-10"
                  />
                </div>

                {/* Display calculated discount amount */}
                <div className="flex justify-between items-center text-destructive">
                  <span className="text-sm font-medium">Discount ({discountPercent}%):</span>
                  <span className="font-semibold">- Rs. {discountAmount.toFixed(2)}</span>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <span className="text-md font-bold">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary">
                    Rs.{' '}
                    {finalTotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>
              </div>

              <Button
                className="w-full h-12 font-semibold text-base"
                size="sm"
                disabled={cartItems.length === 0}
                onClick={() => {
                  // Add your "Complete Sale" logic here
                  setOpen(true)
                }}
              >
                <Check className="mr-2 h-5 w-5" />
                Complete Sale
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Invoice Dialog */}
      <InvoiceDialog
        open={open}
        onOpenChange={setOpen}
        invoiceData={invoiceData}
        onPrint={() => window.print()}
        onNewSale={() => setOpen(false)}
      />
    </div>
  )
}

export default SalesPage
