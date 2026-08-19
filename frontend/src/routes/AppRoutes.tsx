import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import SplashPage from '../pages/Splash'
import LoginPage from '../pages/Login'
import RegisterPage from '../pages/Register'
import ForgotPasswordPage from '../pages/ForgotPassword'
import DashboardPage from '../pages/Dashboard'
import GamesPage from '../pages/Games'
import ProfilePage from '../pages/Profile'
import PlayersPage from '../pages/Players'
import MenuPage from '../pages/Menu'
import ManageRachaPage from '../pages/ManageRacha'
import CreateManageRachaPage from '../pages/ManageRacha/CreatePage'

import ProtectedRoute from './ProtectedRoute'
import { useAuth } from '../contexts/AuthContext'

function AdminRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!user.is_admin) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<SplashPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/games"
          element={
            <ProtectedRoute>
              <GamesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/players"
          element={
            <ProtectedRoute>
              <PlayersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <MenuPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-racha"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <ManageRachaPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-racha/create"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <CreateManageRachaPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}