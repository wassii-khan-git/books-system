// import Versions from './components/Versions'
// import electronLogo from './assets/electron.svg'
import { useEffect } from 'react'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

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
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-400">Books Manager</h1>
        <button className="rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-500 transition">
          Add New Book
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Example Card */}
        <div className="rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-lg">
          <h2 className="text-xl font-semibold">The Great Gatsby</h2>
          <p className="text-gray-400">F. Scott Fitzgerald</p>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-green-400">● Synced to Neon</span>
            <button className="text-red-400 hover:underline">Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
