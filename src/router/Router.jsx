import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import RootLayout from '../layout/RootLayout'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Tasks from '../pages/Tasks'
import Courses from '../pages/Courses'
import Reservations from '../pages/Reservations'
import NotFound from '../pages/NotFound'

const RequireAuth = () => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export const Router = () => {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />

      <Route element={<RequireAuth />}>
        <Route element={<RootLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="courses" element={<Courses />} />
          <Route path="reservations" element={<Reservations />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default Router
