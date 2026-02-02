import { ipcMain } from 'electron'
import { AddSalesTypes, SalesServices } from '../services/sales.services'

// sales controller
export const salesController = async (): Promise<void> => {
  ipcMain.handle('add-sales', async (_event, data: AddSalesTypes) => {
    return await SalesServices.addSales(data)
  })
  ipcMain.handle('get-sales-by-id', async (_event, id: number) => {
    return await SalesServices.getSalesById(id)
  })
  ipcMain.handle(
    'get-sales',
    async (
      _event,
      { page, limit, searchTerm }: { page: string; limit: string; searchTerm?: string }
    ) => {
      return await SalesServices.getSales({ page, limit, searchTerm })
    }
  )
  ipcMain.handle('update-sales', async (_event, data: AddSalesTypes) => {
    return await SalesServices.updateSales(data)
  })
  ipcMain.handle('delete-sales', async (_event, id: number) => {
    return await SalesServices.deleteSales(id)
  })
}
