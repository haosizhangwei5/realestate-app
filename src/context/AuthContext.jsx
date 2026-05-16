import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

// 認証状態をアプリ全体に提供するプロバイダー
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // 初回セッション確認が完了するまで true
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ページ読み込み時に既存セッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // ログイン・ログアウトなど認証状態の変化を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
