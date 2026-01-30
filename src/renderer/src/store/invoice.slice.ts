// src/store/use-cart-store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CartItem } from './cart.slice'

export interface InvoiceItem {
  items: CartItem[]
  totals: {
    subtotal: number
    discountAmount: number
    total: number
    discount: number
  }
}

interface CartState {
  invoiceItems: InvoiceItem
  addInvoice: (invoice: InvoiceItem) => void
  clearInvoice: () => void
}

export const useInvoiceStore = create<CartState>()(
  persist(
    (set) => ({
      invoiceItems: {
        items: [],
        totals: {
          subtotal: 0,
          discountAmount: 0,
          total: 0,
          discount: 0
        }
      },
      // add to invoice
      addInvoice: (invoice: InvoiceItem) => {
        set(() => ({
          invoiceItems: {
            items: invoice.items,
            totals: {
              subtotal: invoice.totals?.subtotal,
              discountAmount: invoice.totals?.discount,
              total: invoice.totals?.total,
              discount: invoice.totals?.discount
            }
          }
        }))
      },
      clearInvoice: () =>
        set({
          invoiceItems: {
            items: [],
            totals: {
              subtotal: 0,
              discountAmount: 0,
              total: 0,
              discount: 0
            }
          }
        })
    }),
    {
      name: 'pos-invoice-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage)
    }
  )
)
