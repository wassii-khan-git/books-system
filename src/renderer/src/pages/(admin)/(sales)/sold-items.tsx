// src/app/dashboard/sales/sold-items/page.tsx
'use client'

import React, { JSX, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Search,
  Download,
  Filter,
  Calendar,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Eye,
  ArrowUpDown,
  FileText
} from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useQuery } from '@tanstack/react-query'
import useDebounce from '@/hooks/use-debounce'

// Sold Items Page
const SoldItemsPage = (): JSX.Element => {
  // search term
  const [searchTerm, setSearchTerm] = useState<string>('')

  // get search term
  const { debounceValue } = useDebounce({ value: searchTerm, delay: 500 })

  // selected sale
  const [selectedSale, setSelectedSale] = useState<any>(null)

  // fetch sales
  const { data: sales } = useQuery({
    queryKey: ['sales', debounceValue],
    queryFn: async () => {
      const result = await window.api?.getSales({ page: 1, limit: 10, searchTerm: debounceValue })
      return result
    }
  })

  console.log('saless----', sales)

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales History</h1>
          <p className="text-sm text-muted-foreground">
            View and manage all completed transactions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="md:col-span-2">
              <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by invoice or customer..."
                  className="pl-9 h-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Payment Method Filter */}
            <div>
              <Label htmlFor="payment-filter" className="text-sm font-medium mb-2 block">
                Payment Method
              </Label>
              <Select>
                <SelectTrigger id="payment-filter" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Methods</SelectItem>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                  <SelectItem value="EASYPAISA">EasyPaisa</SelectItem>
                  <SelectItem value="JazzCash">JazzCash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter */}
            <div>
              <Label htmlFor="date-filter" className="text-sm font-medium mb-2 block">
                Date
              </Label>
              <Select>
                <SelectTrigger id="date-filter" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Dates</SelectItem>
                  <SelectItem value="2024-02-09">Feb 09, 2024</SelectItem>
                  <SelectItem value="2024-02-08">Feb 08, 2024</SelectItem>
                  <SelectItem value="2024-02-07">Feb 07, 2024</SelectItem>
                  <SelectItem value="2024-02-06">Feb 06, 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card className="shadow-sm">
        <Table>
          <TableHeader className="bg-slate-100/50">
            <TableRow>
              <TableHead className="w-35">
                <div className="flex items-center gap-2">
                  Invoice #
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  Date & Time
                  <Calendar className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-center">Items</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-center">Discount</TableHead>
              <TableHead className="text-center">Total Amount</TableHead>
              <TableHead className="w-25 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales?.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-64 text-center">
                  <ShoppingBag className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                  <p className="text-slate-500 font-medium">No sales found</p>
                  <p className="text-xs text-slate-400">Try adjusting your filters</p>
                </TableCell>
              </TableRow>
            ) : (
              sales?.data?.map((sale) => (
                <TableRow key={sale.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium text-primary">
                    {sale.receiptNo.slice(0, 8) + '...'}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">
                        {new Date(sale.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(sale.createdAt).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: 'numeric'
                        })}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-semibold">
                      {sale.items?.length || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${sale.payments?.[0]?.method === 'Cash' ? 'bg-green-500' : 'bg-blue-500'} text-white`}
                    >
                      {sale.payments?.[0]?.method || 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {sale.discount > 0 ? (
                      <span className="text-orange-600 font-semibold">- Rs. {sale.discount}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-bold text-lg text-primary">
                      Rs. {sale.totalAmount.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedSale(sale)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">Transaction Details</DialogTitle>
                          <DialogDescription>
                            Invoice: {sale.invoiceNumber} | {sale.date} at {sale.time}
                          </DialogDescription>
                        </DialogHeader>

                        {selectedSale && (
                          <div className="space-y-6 mt-4">
                            {/* Customer & Payment Info */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-muted-foreground text-xs">
                                  Customer Name
                                </Label>
                                <p className="font-semibold text-lg"></p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-muted-foreground text-xs">
                                  Payment Method
                                </Label>
                                <Badge></Badge>
                              </div>
                            </div>

                            <Separator />

                            {/* Items Table */}
                            <div>
                              <h3 className="font-semibold mb-3">Items Purchased</h3>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Book</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-center">Qty</TableHead>
                                    <TableHead className="text-right">Unit Price</TableHead>
                                    <TableHead className="text-right">Subtotal</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {selectedSale.items.map((item: any) => (
                                    <TableRow key={item.id}>
                                      <TableCell>
                                        <p className="font-medium">{item.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {item.author}
                                        </p>
                                      </TableCell>
                                      <TableCell>
                                        <Badge variant="outline" className="text-xs">
                                          {item.company}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        <Badge className="bg-emerald-600 text-white text-xs">
                                          {item.category}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-center font-semibold">
                                        {item.quantity}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        Rs. {item.unitPrice}
                                      </TableCell>
                                      <TableCell className="text-right font-semibold">
                                        Rs. {item.quantity * item.unitPrice}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>

                            <Separator />

                            {/* Total Summary */}
                            <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Subtotal:</span>
                                <span className="font-semibold text-lg">Rs. </span>
                              </div>

                              <div className="flex justify-between items-center text-orange-600">
                                <span className="font-medium">Discount:</span>
                                <span className="font-semibold">- Rs. </span>
                              </div>

                              <Separator />
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-lg">Total Amount:</span>
                                <span className="text-2xl font-bold text-primary">Rs.</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                              <Button className="flex-1">
                                <FileText className="mr-2 h-4 w-4" />
                                Print Invoice
                              </Button>
                              <Button variant="outline" className="flex-1">
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Results Summary */}
        {sales?.data?.length > 0 && (
          <div className="border-t p-4">
            <p className="text-sm text-muted-foreground text-center">
              Showing <span className="font-semibold text-foreground">{sales?.data?.length}</span>{' '}
              of <span className="font-semibold text-foreground">{sales?.data?.length}</span>{' '}
              transactions
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}

export default SoldItemsPage
