import React, { JSX, useEffect } from 'react'
import SectionCards from '@/components/section-cards'
import RecentActivity from '@/components/recent-activity'

const HomePage = (): JSX.Element => {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  useEffect(() => {
    const getUsersData = async (): Promise<void> => {
      try {
        const response = await window.api.getUsers()
        console.log('response=--==', response)
      } catch (error) {
        console.log('error--', error)
      }
    }
    getUsersData()
  }, [])
  return (
    <div className="w-full">
      <main>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards
                totalCustomers={0}
                totalProducts={123}
                totalSales={213}
                newOrders={2523}
              />
              {/* Recent activity */}
              <RecentActivity newCustomers={[]} newOrders={[]} newProducts={[]} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage
