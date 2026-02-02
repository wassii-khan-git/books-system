import { productSchema } from '../../renderer/src/pages/(admin)/(add-product)/validations'
import prisma from '../lib/prisma'
import { ResponseTypes } from '../types'

export type AddProductTypes = {
  id?: number
  productId: string
  categoryId: number
  companyId: number
  title: string
  author: string
  description: string
  publisher: string
  quantity: number
  price: number
  originalPrice: number
  language: string
  isbn: string
  pages: number
  inStock: boolean
  off: number
}

export const ProductServices = {
  // add product
  addProduct: async (data: AddProductTypes): Promise<ResponseTypes> => {
    try {
      // Validate FormData
      const validation = productSchema.safeParse(data)

      if (!validation.success) {
        return {
          success: false,
          message: validation.error.message
        }
      }

      const { title, isbn } = data

      // Check if product already exists
      const existingProduct = await prisma.product.findFirst({
        where: { title, isbn }
      })

      if (existingProduct) {
        return { success: false, message: 'Please make sure the Title and ISBN are unique' }
      }

      // new product
      const newProduct = await prisma.product.create({
        data: {
          title: data.title,
          author: data.author,
          description: data.description,
          price: data.price,
          originalPrice: data.originalPrice,
          quantity: data.quantity,
          isbn: String(data.isbn),
          pages: data.pages,
          language: data.language,
          publisher: data.publisher as string,
          inStock: data.inStock,
          off: data.off,
          // Foreign keys
          categoryId: data.categoryId,
          companyId: data.companyId
        }
      })

      // return the response
      return { success: true, message: 'Product added successfully', data: newProduct }
    } catch (error) {
      console.log('error--', error)
      return { success: false, message: 'Error adding product' + error }
    }
  },
  // get products
  getProducts: async ({
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
        // get products
        const products = await prisma.product.findMany({
          where: {
            OR: [
              { title: { contains: searchTerm } },
              { author: { contains: searchTerm } },
              { publisher: { contains: searchTerm } },
              { isbn: { contains: searchTerm } }
            ]
          },
          include: { category: true, company: true }
        })
        // return
        return {
          success: true,
          message: 'products fetched successfully',
          data: products
        }
      }

      // pagination
      const skip = Number((pageNumber - 1) * limitNumber)
      // get products
      const products = await prisma.product.findMany({
        skip: skip,
        take: limitNumber,
        include: { category: true, company: true }
      })
      // total
      const total = await prisma.product.count()

      return {
        success: true,
        message: 'products fetched successfully',
        data: products,
        pagination: {
          page,
          limit,
          total
        }
      }
    } catch (error) {
      console.log('error--', error)
      return { success: false, message: 'Error fetching products' + error }
    }
  },
  // get products
  getProductById: async (productId: number): Promise<ResponseTypes> => {
    try {
      // validation
      if (!productId || productId === undefined || productId === null) {
        return { success: false, message: 'Page or limit is required' + productId }
      }

      // get product by Id
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { category: true, company: true }
      })

      if (!product) {
        return { success: false, message: 'Product not found' }
      }

      return {
        success: true,
        message: 'product fetched successfully',
        data: product
      }
    } catch (error) {
      console.log('error--', error)
      return { success: false, message: 'Error fetching products' + error }
    }
  },
  // update product
  updateProduct: async (data: AddProductTypes): Promise<ResponseTypes> => {
    try {
      // validation
      const validation = productSchema.safeParse(data)
      // if validation fails
      if (!validation.success) {
        return { success: false, message: validation.error.message }
      }
      // check if id is provided
      if (!data?.id || data?.id === undefined || data?.id === null) {
        return { success: false, message: 'Product id is required' + data?.id }
      }

      const product = await prisma.product.update({
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
      return { success: true, message: 'product updated successfully', data: product }
    } catch (error) {
      console.log('error--', error)
      return { success: false, message: 'Error updating product' + error }
    }
  },
  // delete product
  deleteProduct: async (id: number): Promise<ResponseTypes> => {
    try {
      // validation
      if (!id || id === undefined || id === null) {
        return { success: false, message: 'product id is required:--' + id }
      }
      // Check if product already exists
      const existingProduct = await prisma.product.findUnique({
        where: { id },
        include: { category: true, company: true }
      })

      if (!existingProduct) {
        return { success: false, message: "Product doesn't exists" }
      }

      // delete product
      const product = await prisma.product.delete({
        where: { id }
      })
      return { success: true, message: 'Product deleted successfully', data: product }
    } catch (error) {
      console.log('error--', error)
      return { success: false, message: 'Error deleting product' + error }
    }
  }
}
