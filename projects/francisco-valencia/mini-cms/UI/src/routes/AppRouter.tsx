import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import PageEditor from '../pages/PageEditor'
import PublicPage from '../pages/PublicPage'
import { ProtectedRoute } from '../auth/ProtectedRoute'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/p/:slug" element={<PublicPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/page/:id"
        element={
          <ProtectedRoute>
            <PageEditor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/page/new"
        element={
          <ProtectedRoute>
            <PageEditor />
          </ProtectedRoute>
        }
      />

      {/* any other redirect to /dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}
