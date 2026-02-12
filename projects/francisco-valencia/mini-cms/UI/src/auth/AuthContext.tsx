import { createContext, useContext, useState } from 'react'
import { getToken, setToken, clearToken } from '../utils/storage'

interface AuthContextType {
  token: string | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [tokenState, setTokenState] = useState<string | null>(getToken())

  const login = (token: string) => {
    setToken(token)
    setTokenState(token)
  }

  const logout = () => {
    clearToken()
    setTokenState(null)
  }

  return (
    <AuthContext.Provider value={{ token: tokenState, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)!
