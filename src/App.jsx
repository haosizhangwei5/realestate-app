import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PropertiesPage from './pages/PropertiesPage'

export default function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider で認証状態をアプリ全体に共有 */}
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* /properties は認証済みユーザーのみアクセス可 */}
          <Route
            path="/properties"
            element={
              <ProtectedRoute>
                <PropertiesPage />
              </ProtectedRoute>
            }
          />
          {/* ルートと未定義パスは /properties へリダイレクト */}
          <Route path="/" element={<Navigate to="/properties" replace />} />
          <Route path="*" element={<Navigate to="/properties" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
