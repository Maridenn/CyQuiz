import { Navigate } from 'react-router-dom'
import { useAuth } from '../App'

export default function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}
