import { ipcMain } from 'electron'
import { AddProductTypes, ProductServices } from '../services/product.services'

// products controller
export const productsController = async (): Promise<void> => {
  // get all products
  ipcMain.handle(
    'get-products',
    async (
      _event,
      { page, limit, searchTerm }: { page: string; limit: string; searchTerm?: string }
    ) => {
      return await ProductServices.getProducts({ page, limit, searchTerm })
    }
  )
  // get product by id
  ipcMain.handle('get-product-by-id', async (_event, id: number) => {
    return await ProductServices.getProductById(id)
  })
  ipcMain.handle('add-product', async (_event, data: AddProductTypes) => {
    return await ProductServices.addProduct(data)
  })
  ipcMain.handle('update-product', async (_event, data: AddProductTypes) => {
    return await ProductServices.updateProduct(data)
  })
  ipcMain.handle('delete-product', async (_event, id: number) => {
    return await ProductServices.deleteProduct(id)
  })
}
