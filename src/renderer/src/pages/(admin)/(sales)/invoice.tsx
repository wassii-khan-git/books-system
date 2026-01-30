// src/app/dashboard/sales/page.tsx
'use client'

import React, { JSX } from 'react'
import { Button } from '@/components/ui/button'
import { Printer, Plus, BookOpen } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { CartItem } from '@/store/cart.slice'
import { useInvoiceStore } from '@/store/invoice.slice'
import { useNavigate } from 'react-router-dom'

const InvoicePage = (): JSX.Element => {
  // invoice items
  const invoiceItems = useInvoiceStore((state) => state.invoiceItems)
  // navigate
  const navigate = useNavigate()
  // handle print
  const handlePrint = (): void => {
    window.print()
  }

  return (
    <main className="  py-8 px-4 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto">
        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mb-6 print:hidden">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-primary hover:bg-primary"
            onClick={() => navigate('/dashboard/sales')}
          >
            <Plus className="h-4 w-4" />
            New Sale
          </Button>
        </div>

        {/* Invoice Container */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none">
          <div className="p-12 print:p-8" id="invoice-content">
            {/* Header Section */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                    <BookOpen className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">BOOKSTORE</h1>
                    <p className="text-sm text-gray-500">Your Literary Haven</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">SALES RECEIPT</h2>
                  <p className="text-sm text-gray-500">Original Copy</p>
                </div>
              </div>

              {/* Receipt Info Grid */}
              <div className="grid grid-cols-3 gap-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Receipt No.
                  </p>
                  <p className="text-base font-semibold text-gray-900">#234324324</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Date
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {new Date().toLocaleDateString('en-PK', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Time
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {new Date().toLocaleTimeString('en-PK', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-gray-900">
                    <TableHead className="text-xs font-bold text-gray-900 uppercase tracking-wide py-4 w-12">
                      #
                    </TableHead>
                    <TableHead className="text-xs font-bold text-gray-900 uppercase tracking-wide py-4">
                      Item Description
                    </TableHead>
                    <TableHead className="text-xs font-bold text-gray-900 uppercase tracking-wide py-4 text-right">
                      Price
                    </TableHead>
                    <TableHead className="text-xs font-bold text-gray-900 uppercase tracking-wide py-4 text-center">
                      Qty
                    </TableHead>
                    <TableHead className="text-xs font-bold text-gray-900 uppercase tracking-wide py-4 text-right">
                      Disc.
                    </TableHead>
                    <TableHead className="text-xs font-bold text-gray-900 uppercase tracking-wide py-4 text-right">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceItems.items?.map((item: CartItem, index: number) => (
                    <TableRow key={index} className="border-b border-gray-200">
                      <TableCell className="py-4 text-gray-600 font-medium">{index + 1}</TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-gray-900 text-base">{item?.title}</p>
                          <p className="text-sm text-gray-600">by {item?.author}</p>
                          <p className="text-xs text-gray-500">ISBN: {item?.isbn}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-right text-gray-900 font-medium">
                        Rs. {item?.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded font-semibold text-gray-900">
                          {item?.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-right text-gray-600">
                        {invoiceItems?.totals?.discountAmount > 0 ? `${item?.discount}%` : '—'}
                      </TableCell>
                      <TableCell className="py-4 text-right font-semibold text-gray-900 text-base">
                        Rs. {item?.subtotal?.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Totals Section */}
            <div className="flex justify-end mb-10">
              <div className="w-80 space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="text-gray-900 font-semibold text-lg">
                    Rs. {invoiceItems.totals?.subtotal?.toFixed(2)}
                  </span>
                </div>

                {parseFloat(String(invoiceItems.totals?.discountAmount)) > 0 && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-red-600 font-medium">Additional Discount</span>
                    <span className="text-red-600 font-semibold text-lg">
                      - Rs. {invoiceItems.totals?.discountAmount?.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="border-t-2 border-gray-300 my-3"></div>

                <div className=" border-2 border-primary rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-bold text-xl">TOTAL</span>
                    <span className="text-primary font-bold text-3xl">
                      Rs. {invoiceItems.totals?.total?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t-2 border-gray-200 pt-8 space-y-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-primary mb-1">
                  Thank you for your purchase!
                </p>
                <p className="text-sm text-gray-600">We hope to see you again soon</p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-200 text-xs text-gray-500">
                <div>
                  <p className="font-semibold text-gray-700 mb-2">Contact Information</p>
                  <p>123 Book Street, Reading City</p>
                  <p>Phone: +92 (051) 123-4567</p>
                  <p>Email: info@bookstore.com</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-700 mb-2">Store Hours</p>
                  <p>Monday - Saturday: 9:00 AM - 8:00 PM</p>
                  <p>Sunday: 10:00 AM - 6:00 PM</p>
                  <p className="mt-2 italic">Visit us at www.bookstore.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default InvoicePage
