import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const auth = useSelector(state => state.auth)
  const isAuthenticated = auth?.isAuthenticated
  const location = useLocation()
  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />
}
