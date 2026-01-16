// import Versions from './components/Versions'
// import electronLogo from './assets/electron.svg'
import { useEffect } from 'react'
import { Button } from './components/ui/button'

function App(): React.JSX.Element {
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
    <div className="min-h-screen">
      {/* Example Card */}
      <Button variant="default" size="sm">
        Add New Book
      </Button>
    </div>
  )
}

export default App
