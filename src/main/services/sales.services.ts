import { PaymentMethod } from '../../generated/prisma/enums'
import { salesSchema } from '../../renderer/src/pages/(admin)/(sales)/sales.schema'
import prisma from '../lib/prisma'
import { ResponseTypes } from '../types'

// addSalesTypes refined for the transaction
export interface AddSalesTypes {
  subTotal: number
  tax: number
  discount: number
  totalAmount: number
  paymentMethod: PaymentMethod
  items: {
    productId: number
    quantity: number
    unitPrice: number
    productName: string
  }[]
}

export const SalesServices = {
  // add sale
  addSales: async (data: AddSalesTypes): Promise<ResponseTypes> => {
    try {
      // Use $transaction to ensure data integrity
      const result = await prisma.$transaction(async (tx) => {
        // 1. Create the Main Sale record
        const sale = await tx.sale.create({
          data: {
            subTotal: data.subTotal,
            tax: data.tax,
            discount: data.discount,
            totalAmount: data.totalAmount,
            // Create the payment record at the same time
            payments: {
              create: {
                amount: data.totalAmount,
                method: data.paymentMethod
              }
            },
            // Create all sale items
            items: {
              create: data.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.unitPrice * item.quantity,
                productName: item.productName
              }))
            }
          },
          include: { items: true, payments: true }
        })

        // 2. Update Inventory for each product
        for (const item of data.items) {
          const product = await tx.product.findUnique({
            where: { id: item.productId }
          })

          if (!product || product.quantity < item.quantity) {
            throw new Error(`Insufficient stock for ${item.productName}`)
          }

          await tx.product.update({
            where: { id: item.productId },
            data: {
              quantity: {
                decrement: item.quantity
              }
            }
          })
        }

        return sale
      })

      return { success: true, message: 'Sale completed successfully', data: result }
    } catch (error: any) {
      console.error('Transaction Error:', error)
      return { success: false, message: error.message || 'Failed to process sale' }
    }
  },
  // get saless
  getSales: async ({
    page,
    limit,
    searchTerm
  }: {
    page: string
    limit: string
    searchTerm?: string
  }): Promise<ResponseTypes> => {
    try {
      const pageNumber = Number(page)
      const limitNumber = Number(limit)

      // validation
      if (!pageNumber || pageNumber === undefined || !limit || limit === undefined) {
        return { success: false, message: 'Page or limit is required' + page + '--' + limit }
      }
      // If search Term exists in the props
      if (searchTerm && searchTerm.length > 0) {
        // get saless
        const saless = await prisma.sale.findMany({
          where: {
            // OR: [
            //   { title: { contains: searchTerm } },
            //   { author: { contains: searchTerm } },
            //   { publisher: { contains: searchTerm } },
            //   { isbn: { contains: searchTerm } }
            // ]
          },
          include: { items: true, payments: true }
        })
        // return
        return {
          success: true,
          message: 'saless fetched successfully',
          data: saless
        }
      }

      // pagination
      const skip = Number((pageNumber - 1) * limitNumber)
      // get saless
      const saless = await prisma.sale.findMany({
        skip: skip,
        take: limitNumber,
        include: { items: { include: { product: true } }, payments: true }
      })
      // total
      const total = await prisma.sale.count()

      return {
        success: true,
        message: 'saless fetched successfully',
        data: saless,
        pagination: {
          page,
          limit,
          total
        }
      }
    } catch (error) {
      console.log('error--', error)
      return { success: false, message: 'Error fetching saless' + error }
    }
  },
  // get saless
  getSalesById: async (salesId: number): Promise<ResponseTypes> => {
    try {
      // validation
      if (!salesId || salesId === undefined || salesId === null) {
        return { success: false, message: 'Page or limit is required' + salesId }
      }

      // get sales by Id
      const sales = await prisma.sale.findUnique({
        where: { id: salesId },
        include: { items: { include: { product: true } } }
      })

      if (!sales) {
        return { success: false, message: 'sales not found' }
      }

      return {
        success: true,
        message: 'Sales fetched successfully',
        data: sales
      }
    } catch (error) {
      console.log('error--', error)
      return { success: false, message: 'Error fetching saless' + error }
    }
  },
  // update sales
  updateSales: async (data: AddSalesTypes): Promise<ResponseTypes> => {
    try {
      // validation
      const validation = salesSchema.safeParse(data)
      // if validation fails
      if (!validation.success) {
        return { success: false, message: validation.error.message }
      }
      // check if id is provided
      if (!data?.id || data?.id === undefined || data?.id === null) {
        return { success: false, message: 'sales id is required' + data?.id }
      }

      const sales = await prisma.sale.update({
        where: { id: Number(data?.id) },
        data: {
          categoryId: data?.categoryId,
          companyId: data?.companyId,

          title: data?.title,
          author: data?.author,
          description: data?.description,
          price: data?.price,
          originalPrice: data?.originalPrice,
          quantity: data?.quantity,
          isbn: String(data?.isbn),
          pages: data?.pages,
          language: data?.language,
          publisher: data?.publisher,
          inStock: data?.inStock,
          off: data?.off
        }
      })
      return { success: true, message: 'sales updated successfully', data: sales }
    } catch (error) {
      console.log('error--', error)
      return { success: false, message: 'Error updating sales' + error }
    }
  },
  // delete sales
  deleteSales: async (id: number): Promise<ResponseTypes> => {
    try {
      // validation
      if (!id || id === undefined || id === null) {
        return { success: false, message: 'sales id is required:--' + id }
      }
      // Check if sales already exists
      const existingsales = await prisma.sale.findUnique({
        where: { id },
        include: { category: true, company: true }
      })

      if (!existingsales) {
        return { success: false, message: "sales doesn't exists" }
      }

      // delete sales
      const sales = await prisma.sale.delete({
        where: { id }
      })
      return { success: true, message: 'sales deleted successfully', data: sales }
    } catch (error) {
      console.log('error--', error)
      return { success: false, message: 'Error deleting sales' + error }
    }
  }
}
