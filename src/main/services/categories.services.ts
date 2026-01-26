import { categorySchema } from '../../renderer/src/pages/(admin)/(add-category)/validations'
import prisma from '../lib/prisma'
import { ResponseTypes } from '../types'

export type AddCategoryTypes = {
  id?: number
  title: string
  description: string
}

export const CategoriesServices = {
  // add category
  addCategory: async ({ title, description }: AddCategoryTypes): Promise<ResponseTypes> => {
    try {
      // validate user input
      const validation = categorySchema.safeParse({ title, description })
      // if validation fails
      if (!validation.success) {
        return { success: false, message: validation.error.message }
      }
      // check if category exists
      const category = await prisma.category.findFirst({
        where: { title }
      })
      // if category already exists
      if (category) {
        return { success: false, message: 'Category already exists' }
      }
      // create category
      const newCategory = await prisma.category.create({
        data: {
          title: title,
          description: description
        }
      })
      // return the response
      return { success: true, message: 'Category added successfully', data: newCategory }
    } catch (error) {
      console.log('error--', error)
      return { success: false, message: 'Error adding category' + error }
    }
  },
  // get categories
  getCategories: async ({
    page,
    limit
  }: {
    page: string
    limit: string
  }): Promise<ResponseTypes> => {
    try {
      const pageNumber = Number(page)
      const limitNumber = Number(limit)

      // validation
      if (!pageNumber || pageNumber === undefined || !limit || limit === undefined) {
        return { success: false, message: 'Page or limit is required' + page + '--' + limit }
      }

      // pagination
      const skip = Number((pageNumber - 1) * limitNumber)
      // get categories
      const categories = await prisma.category.findMany({
        skip: skip,
        take: limitNumber
      })

      const total = await prisma.category.count()

      return {
        success: true,
        message: 'Categories fetched successfully',
        data: categories,
        pagination: {
          page,
          limit,
          total
        }
      }
    } catch (error) {
      console.log('error--', error)
      return { success: false, message: 'Error fetching categories' + error }
    }
  },
  // get category by id
  getCategoryById: async (id: number): Promise<ResponseTypes> => {
    try {
      const category = await prisma.category.findFirst({
        where: { id }
      })
      return { success: true, message: 'Category fetched successfully', data: category }
    } catch (error) {
      console.log('error--', error)
      return { success: false, message: 'Error fetching category' + error }
    }
  },
  // update category
  updateCategory: async ({ id, title, description }: AddCategoryTypes): Promise<ResponseTypes> => {
    // data
    const data = {
      title: title,
      description: description
    }
    try {
      // validation
      const validation = categorySchema.safeParse(data)
      if (!validation.success) {
        return { success: false, message: validation.error.message }
      }
      // check if id is provided
      if (!id || id === undefined || id === null) {
        return { success: false, message: 'Category id is required' }
      }

      const category = await prisma.category.update({
        where: { id: Number(id) },
        data
      })
      return { success: true, message: 'Category updated successfully', data: category }
    } catch (error) {
      console.log('error--', error)
      return { success: false, message: 'Error updating category' + error }
    }
  },
  // delete category
  deleteCategory: async (id: number): Promise<ResponseTypes> => {
    try {
      // validation
      if (!id || id === undefined || id === null) {
        return { success: false, message: 'Category id is required:--' + id }
      }

      const category = await prisma.category.delete({
        where: { id }
      })
      return { success: true, message: 'Category deleted successfully', data: category }
    } catch (error) {
      console.log('error--', error)
      return { success: false, message: 'Error deleting category' + error }
    }
  }
}
