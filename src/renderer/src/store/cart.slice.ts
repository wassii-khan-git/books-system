// src/store/use-cart-store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ProductTypes } from '@/pages/(admin)/(products)/columns'

export interface CartItem extends ProductTypes {
  quantity: number
  discount: number
  subtotal: number
}

interface CartState {
  cartItems: CartItem[]
  addToCart: (product: ProductTypes) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartItems: [],
      // add to cart
      addToCart: (product) => {
        set((state) => {
          const existingItem = state.cartItems.find((item) => item.id === product.id)

          if (existingItem) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.id === product.id
                  ? {
                      ...item,
                      quantity: item.quantity + 1,
                      subtotal: (item.quantity + 1) * item.price
                    }
                  : item
              )
            }
          }
          // new item
          const newItem: CartItem = {
            ...product,
            quantity: 1,
            discount: 0,
            subtotal: product.price
          }
          // add to cart
          return { cartItems: [...state.cartItems, newItem] }
        })
      },
      // remove from cart
      removeFromCart: (productId) => {
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== productId)
        }))
      },
      // update quantity
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === productId
              ? {
                  ...item,
                  quantity: Math.max(1, quantity),
                  subtotal: Math.max(1, quantity) * item.price
                }
              : item
          )
        }))
      },
      // clear cart
      clearCart: () => set({ cartItems: [] })
    }),
    {
      name: 'pos-cart-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage)
    }
  )
)
