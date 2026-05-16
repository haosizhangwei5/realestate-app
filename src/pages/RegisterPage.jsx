import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('パスワードが一致しません')
      return
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      // 既に登録済みのメールアドレスなどのエラーを日本語で表示
      if (error.message.includes('already registered')) {
        setError('このメールアドレスは既に登録されています')
      } else {
        setError('会員登録に失敗しました。もう一度お試しください')
      }
      setLoading(false)
      return
    }

    // 登録成功後は物件一覧へ遷移
    navigate('/properties')
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-logo">不動産管理</h1>
          <h2 className="auth-title">会員登録</h2>
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
            <label htmlFor="password" className="form-label">パスワード（6文字以上）</label>
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

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">パスワード（確認）</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              placeholder="パスワードを再入力"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '登録中...' : '会員登録'}
          </button>
        </form>

        <p className="auth-footer">
          既にアカウントをお持ちの方は
          <Link to="/login" className="auth-link">ログイン</Link>
        </p>
      </div>
    </div>
  )
}
