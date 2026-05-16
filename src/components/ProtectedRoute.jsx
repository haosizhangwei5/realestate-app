import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// 未ログインユーザーをログイン画面へリダイレクトするラッパー
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  // セッション確認中はローディング表示
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
