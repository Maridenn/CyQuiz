import { createContext, useContext, useState, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'

export const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export default function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored && token) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
    setLoading(false)
  }, [token])

  const login = (userData, tok) => {
    setUser(userData)
    setToken(tok)
    localStorage.setItem('token', tok)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  if (loading) return <div className="spinner" />

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin: user?.role === 'admin' }}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthContext.Provider>
  )
}
