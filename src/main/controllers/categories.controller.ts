import { ipcMain } from 'electron'
import { AddCategoryTypes, CategoriesServices } from '../services/categories.services'

// Categories controller
export const categoriesController = async (): Promise<void> => {
  // get all categories
  ipcMain.handle(
    'get-categories',
    async (_event, { page, limit }: { page: string; limit: string }) => {
      return await CategoriesServices.getCategories({ page, limit })
    }
  )
  ipcMain.handle('get-category-by-id', async (_event, id: number) => {
    return await CategoriesServices.getCategoryById(id)
  })
  ipcMain.handle('add-category', async (_event, { title, description }: AddCategoryTypes) => {
    return await CategoriesServices.addCategory({ title, description })
  })
  ipcMain.handle(
    'update-category',
    async (_event, { id, title, description }: AddCategoryTypes) => {
      return await CategoriesServices.updateCategory({ id, title, description })
    }
  )
  ipcMain.handle('delete-category', async (_event, id: number) => {
    return await CategoriesServices.deleteCategory(id)
  })
}
