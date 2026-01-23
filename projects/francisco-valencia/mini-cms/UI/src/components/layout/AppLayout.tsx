import * as React from 'react'
import { useAuth } from '../../auth/AuthContext'
import { useNavigate } from 'react-router-dom'


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isLoggedIn = React.useMemo(() => {
    return Boolean(token)
  }, [token])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="border-b flex justify-between items-center p-[10px]">
        <h1 className="font-semibold">CMS</h1>

        {/* put home element when logged in */}
        {isLoggedIn && (
          <div className="flex items-center gap-[16px]">
            <a href="/dashboard">Dashboard</a>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </header>
      <main className="p-6 mx-auto p-[10px] w-full">{children}</main>
    </div>
  )
}
