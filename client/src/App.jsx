import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage.jsx'
import Navbar from './components/Navbar.jsx'
import AppRoutes from './routes/AppRoutes.jsx'
import { getToken } from './api.js'
import { clearUser, restoreSession, selectAuthStatus, selectUser, setUser } from './store/authSlice'

export default function App() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const authStatus = useSelector(selectAuthStatus)
  const navigate = useNavigate()

  useEffect(() => {
    if (getToken()) {
      dispatch(restoreSession())
    } else {
      dispatch(clearUser())
    }
  }, [dispatch])

  if (authStatus === 'loading') {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div></div>
  }

  const handleAuthSuccess = (userData) => {
    dispatch(setUser(userData))
    dispatch(restoreSession())
  }

  const handleLogout = () => {
    dispatch(clearUser())
    navigate('/auth')
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white">
      {user ? (
        <>
          <Navbar onLogout={handleLogout} />
          <AppRoutes />
        </>
      ) : (
        <Routes>
          <Route path="/auth" element={<AuthPage onSuccess={handleAuthSuccess} />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      )}
    </div>
  )
}
