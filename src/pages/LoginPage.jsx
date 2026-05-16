import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      // Supabaseのエラーメッセージを日本語に変換
      setError('メールアドレスまたはパスワードが正しくありません')
      setLoading(false)
      return
    }

    navigate('/properties')
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-logo">不動産管理</h1>
          <h2 className="auth-title">ログイン</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <p className="form-error">{error}</p>}

          <div className="form-group">
            <label htmlFor="email" className="form-label">メールアドレス</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">パスワード</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="パスワードを入力"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        <p className="auth-footer">
          アカウントをお持ちでない方は
          <Link to="/register" className="auth-link">会員登録</Link>
        </p>
      </div>
    </div>
  )
}
