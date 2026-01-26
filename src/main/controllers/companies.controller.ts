import { ipcMain } from 'electron'
import { AddCompanyTypes, CompaniesServices } from '../services/companies.services'

// companies controller
export const companiesController = async (): Promise<void> => {
  // get all companies
  ipcMain.handle(
    'get-companies',
    async (_event, { page, limit }: { page: string; limit: string }) => {
      return await CompaniesServices.getCompanies({ page, limit })
    }
  )
  ipcMain.handle(
    'add-company',
    async (_event, { name, categoryId, percentage }: AddCompanyTypes) => {
      return await CompaniesServices.addCompany({ name, categoryId, percentage })
    }
  )
  ipcMain.handle(
    'update-company',
    async (_event, { id, name, categoryId, percentage }: AddCompanyTypes) => {
      return await CompaniesServices.updateCompany({ id, name, categoryId, percentage })
    }
  )
  ipcMain.handle('delete-company', async (_event, id: number) => {
    return await CompaniesServices.deleteCompany(id)
  })
}
