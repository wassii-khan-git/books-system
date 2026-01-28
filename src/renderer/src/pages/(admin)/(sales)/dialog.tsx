// src/app/dashboard/sales/page.tsx
'use client'

import React, { JSX } from 'react'
import { Button } from '@/components/ui/button'
import { Printer, Receipt, Check } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { CartItem } from '@/store/cart.slice'

// Invoice Dialog Component
interface InvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoiceData?: any
  onPrint: () => void
  onNewSale: () => void
}

const InvoiceDialog = ({
  open,
  onOpenChange,
  invoiceData,
  onPrint,
  onNewSale
}: InvoiceDialogProps): JSX.Element => {
  if (!invoiceData) return <></>

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" />
            Sales Receipt
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4" id="invoice-content">
          {/* Header */}
          <div className="text-center border-b-2 border-primary/20 pb-6">
            <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              BOOK STORE
            </h1>
            <p className="text-lg text-muted-foreground mt-2">Sales Receipt</p>
            <div className="flex justify-center gap-8 mt-4 text-sm">
              <div>
                <span className="text-muted-foreground">Receipt #:</span>
                <span className="font-semibold ml-2">{invoiceData.invoiceNumber}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Date:</span>
                <span className="font-semibold ml-2">
                  {new Date().toLocaleDateString('en-PK', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Time:</span>
                <span className="font-semibold ml-2">
                  {new Date().toLocaleTimeString('en-PK', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-bold">#</TableHead>
                  <TableHead className="font-bold">Book Details</TableHead>
                  <TableHead className="text-right font-bold">Price</TableHead>
                  <TableHead className="text-center font-bold">Qty</TableHead>
                  <TableHead className="text-right font-bold">Discount</TableHead>
                  <TableHead className="text-right font-bold">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceData.items?.map((item: CartItem, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{item?.title}</p>
                        <p className="text-sm text-muted-foreground">{item?.author}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">ISBN: {item?.isbn}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">Rs. {item?.price.toFixed(2)}</TableCell>
                    <TableCell className="text-center font-semibold">{item?.quantity}</TableCell>
                    <TableCell className="text-right">
                      {invoiceData?.totals?.discountAmount > 0 ? `${item?.discount}%` : '-'}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      Rs. {item?.subtotal?.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-96 space-y-3">
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-semibold">Rs. {invoiceData.totals?.subtotal}</span>
              </div>

              {parseFloat(invoiceData.totals?.discountAmount) > 0 && (
                <div className="flex justify-between text-base text-destructive">
                  <span>Additional Discount:</span>
                  <span className="font-semibold">- Rs. {invoiceData.totals?.discountAmount}</span>
                </div>
              )}

              {parseFloat(invoiceData.totals?.taxAmount) > 0 && (
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground">Tax:</span>
                  <span className="font-semibold">Rs. {invoiceData.totals?.taxAmount}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                <span className="text-xl font-bold">TOTAL:</span>
                <span className="text-3xl font-bold text-primary">
                  Rs. {invoiceData.totals?.total?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center border-t pt-6 mt-8">
            <p className="font-semibold text-primary text-lg">Thank you for your purchase!</p>
            <p className="text-sm text-muted-foreground mt-2">Please visit again</p>
          </div>
        </div>

        <DialogFooter className="gap-2 print:hidden border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="outline" onClick={onPrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Receipt
          </Button>
          <Button onClick={onNewSale} className="bg-primary">
            <Check className="mr-2 h-4 w-4" />
            New Sale
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InvoiceDialog
