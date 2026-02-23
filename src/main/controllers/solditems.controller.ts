import { ipcMain } from 'electron'
import { SoldItemsServices } from '../services/solditems.services'
import { PaymentMethod } from '../../generated/prisma/enums'

// sales controller
export const soldItemsController = async (): Promise<void> => {
  // get sold items
  ipcMain.handle(
    'get-solditems',
    async (
      _event,
      {
        page,
        limit,
        searchTerm,
        paymentMethod
      }: { page: number; limit: number; searchTerm?: string; paymentMethod?: PaymentMethod }
    ) => {
      return await SoldItemsServices.getSoldItems({ page, limit, searchTerm, paymentMethod })
    }
  )
  // delete sold item
  ipcMain.handle('delete-solditem', async (_event, { id }: { id: number }) => {
    return await SoldItemsServices.deleteSoldItem(id)
  })
}
