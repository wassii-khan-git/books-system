import { companySchema } from '../../renderer/src/pages/(admin)/(add-Company)/validations'
import prisma from '../lib/prisma'
import { ResponseTypes } from '../types'

export type AddCompanyTypes = {
  id?: number
  name: string
  categoryId: string
  percentage: string
}

export const CompaniesServices = {
  // add Company
  addCompany: async ({ name, categoryId, percentage }: AddCompanyTypes): Promise<ResponseTypes> => {
    try {
      // validate user input
      const validation = companySchema.safeParse({ name, categoryId, percentage })

      // if validation fails
      if (!validation.success) {
        return {
          success: false,
          message: validation.error.message
        }
      }

      // check if Company exists
      // const company = await prisma.company.findFirst({
      //   where: { name }
      // })

      // // if Company already exists
      // if (company) {
      //   return { success: false, message: 'Company already exists' }
      // }

      // create Company
      const newCompany = await prisma.company.create({
        data: {
          name,
          categoryId: parseInt(categoryId, 10),
          percentage: parseFloat(percentage)
        }
      })
      // return the response
      return { success: true, message: 'Company added successfully', data: newCompany }
    } catch (error) {
      console.log('error--', error)
      return { success: false, message: 'Error adding Company' + error }
    }
  },
  // get companies
  getCompanies: async ({
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
      // get companies
      const companies = await prisma.company.findMany({
        skip: skip,
        take: limitNumber,
        include: { category: true }
      })
      // total
      const total = await prisma.company.count()

      return {
        success: true,
        message: 'companies fetched successfully',
        data: companies,
        pagination: {
          page,
          limit,
          total
        }
      }
    } catch (error) {
      console.log('error--', error)
      return { success: false, message: 'Error fetching companies' + error }
    }
  },
  // update Company
  updateCompany: async ({
    id,
    name,
    categoryId,
    percentage
  }: AddCompanyTypes): Promise<ResponseTypes> => {
    // data
    const data = {
      name: name,
      categoryId,
      percentage
    }
    try {
      // validation
      const validation = companySchema.safeParse(data)
      if (!validation.success) {
        return { success: false, message: validation.error.message }
      }
      // check if id is provided
      if (!id || id === undefined || id === null) {
        return { success: false, message: 'Company id is required' }
      }

      const Company = await prisma.company.update({
        where: { id: Number(id) },
        data: {
          name,
          categoryId: parseInt(categoryId, 10),
          percentage: parseFloat(percentage)
        }
      })
      return { success: true, message: 'Company updated successfully', data: Company }
    } catch (error) {
      console.log('error--', error)
      return { success: false, message: 'Error updating Company' + error }
    }
  },
  // delete Company
  deleteCompany: async (id: number): Promise<ResponseTypes> => {
    try {
      // validation
      if (!id || id === undefined || id === null) {
        return { success: false, message: 'Company id is required:--' + id }
      }
      // delete company
      const company = await prisma.company.delete({
        where: { id }
      })
      return { success: true, message: 'Company deleted successfully', data: company }
    } catch (error) {
      console.log('error--', error)
      return { success: false, message: 'Error deleting Company' + error }
    }
  }
}
