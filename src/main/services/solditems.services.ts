import { PaymentMethod } from '../../generated/prisma/enums'
import { salesSchema } from '../../renderer/src/pages/(admin)/(sales)/sales.schema'
import { ResponseTypes } from '../types'
import prisma from '../lib/prisma'
import { AddSalesTypes } from './sales.services'

// Sold Items Types
export interface SoldItemsTypes {
  page: number
  limit: number
  searchTerm?: string
  paymentMethod?: PaymentMethod
}

// Sold Items Services
export const SoldItemsServices = {
  // get saless
  getSoldItems: async ({
    page,
    limit,
    searchTerm,
    paymentMethod
  }: SoldItemsTypes): Promise<ResponseTypes> => {
    try {
      // page + limit
      const pageNumber = Number(page)
      const limitNumber = Number(limit)

      // validation
      if (!pageNumber || pageNumber === undefined || !limit || limit === undefined) {
        return { success: false, message: 'Page or limit is required' + page + '--' + limit }
      }

      // if paymentMethod is provided
      if (paymentMethod) {
        // get saless
        const sales = await prisma.sale.findMany({
          where: {
            payments: {
              some: { method: paymentMethod }
            }
          },
          include: { items: true, payments: true }
        })
        // return
        return {
          success: true,
          message: 'Sold items fetched successfully',
          data: sales
        }
      }

      // If search Term exists in the props
      if (searchTerm && searchTerm.length > 0) {
        // get saless
        const sales = await prisma.sale.findMany({
          where: {
            receiptNo: searchTerm
          },
          include: { items: true, payments: true }
        })

        // return
        return {
          success: true,
          message: 'Sold items fetched successfully',
          data: sales
        }
      }

      // pagination
      const skip = Number((pageNumber - 1) * limitNumber)
      // get sales
      const sales = await prisma.sale.findMany({
        skip: skip,
        take: limitNumber,
        include: { items: { include: { product: true } }, payments: true }
      })
      // total
      const total = await prisma.sale.count()
      // return
      return {
        success: true,
        message: 'sales fetched successfully',
        data: sales,
        pagination: {
          page: String(page),
          limit: String(limit),
          total
        }
      }
    } catch (error) {
      console.log('error--', error)
      return { success: false, message: 'Error fetching saless' + error }
    }
  },
  // get saless
  getSoldItemById: async (salesId: number): Promise<ResponseTypes> => {
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
  updateSoldItem: async (data: AddSalesTypes): Promise<ResponseTypes> => {
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
  deleteSoldItem: async (id: number): Promise<ResponseTypes> => {
    try {
      // validation
      if (!id || id === undefined || id === null) {
        return { success: false, message: 'sales id is required:--' + id }
      }

      // get the sale item
      const saleItems = await prisma.saleItem.findMany({
        where: { id }
      })

      // Check if sales already exists
      const existingsales = await prisma.sale.findUnique({
        where: { id }
      })

      if (!existingsales) {
        return { success: false, message: "Sold item record doesn't exists" }
      }

      // delete sales
      const sales = await prisma.sale.delete({
        where: { id }
      })

      // increment the quantity of product
      await Promise.all(
        saleItems.map((item) => {
          return prisma.product.update({
            where: { id: item.productId },
            data: {
              quantity: {
                increment: item.quantity
              }
            }
          })
        })
      )

      return { success: true, message: 'Sold item record deleted successfully', data: sales }
    } catch (error) {
      console.log('error--', error)
      return { success: false, message: 'Error deleting Sold item record' + error }
    }
  }
}
