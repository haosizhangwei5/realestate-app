import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import PropertyForm from '../components/PropertyForm'

// 家賃を「〇万円」形式にフォーマット
function formatRent(rent) {
  if (rent >= 10000) {
    const man = rent / 10000
    return `${Number.isInteger(man) ? man : man.toFixed(1)}万円`
  }
  return `${rent.toLocaleString()}円`
}

export default function PropertiesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // showForm: モーダルの表示/非表示
  const [showForm, setShowForm] = useState(false)
  // editTarget: null = 新規登録モード、object = 編集モード
  const [editTarget, setEditTarget] = useState(null)

  // =============================================
  // SELECT: ログインユーザーの物件一覧を取得
  // RLS により自分の物件のみが返ってくる
  // =============================================
  const fetchProperties = useCallback(async () => {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError('物件の取得に失敗しました')
    } else {
      setProperties(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  // =============================================
  // INSERT / UPDATE: フォームの保存処理
  // =============================================
  async function handleSave(formData) {
    if (editTarget) {
      // 編集モード: 対象レコードを UPDATE
      const { error } = await supabase
        .from('properties')
        .update(formData)
        .eq('id', editTarget.id)

      if (error) return { error: '物件の更新に失敗しました' }
    } else {
      // 新規モード: user_id を付与して INSERT
      const { error } = await supabase
        .from('properties')
        .insert({ ...formData, user_id: user.id })

      if (error) return { error: '物件の登録に失敗しました' }
    }

    // 成功したらモーダルを閉じて一覧を再取得
    setShowForm(false)
    setEditTarget(null)
    await fetchProperties()
    return {}
  }

  // =============================================
  // DELETE: 物件を削除（RLS により自分の物件のみ削除可）
  // =============================================
  async function handleDelete(property) {
    if (!window.confirm(`「${property.name}」を削除してもよいですか？`)) return

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', property.id)

    if (error) {
      alert('削除に失敗しました')
      return
    }
    // 削除成功: ローカル状態から即時除去（再フェッチ不要）
    setProperties((prev) => prev.filter((p) => p.id !== property.id))
  }

  // 編集ボタンを押したときにモーダルを開く
  function handleEditClick(property) {
    setEditTarget(property)
    setShowForm(true)
  }

  // 新規登録ボタンを押したときにモーダルを開く
  function handleAddClick() {
    setEditTarget(null)
    setShowForm(true)
  }

  function handleFormCancel() {
    setShowForm(false)
    setEditTarget(null)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="app-layout">
      {/* ヘッダー */}
      <header className="header">
        <div className="header-inner">
          <h1 className="header-logo">不動産管理</h1>
          <div className="header-right">
            <span className="header-email">{user?.email}</span>
            <button onClick={handleLogout} className="btn-logout">ログアウト</button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="main">
        <div className="page-title-area">
          <div className="page-title-left">
            <h2 className="page-title">物件一覧</h2>
            {!loading && (
              <span className="property-count">{properties.length}件</span>
            )}
          </div>
          <button onClick={handleAddClick} className="btn-add">
            ＋ 物件を登録
          </button>
        </div>

        {/* ローディング */}
        {loading && (
          <div className="loading-screen">
            <div className="loading-spinner" />
          </div>
        )}

        {/* エラー */}
        {!loading && error && (
          <div className="page-error">
            <p>{error}</p>
            <button onClick={fetchProperties} className="btn-secondary">再読み込み</button>
          </div>
        )}

        {/* 物件なし */}
        {!loading && !error && properties.length === 0 && (
          <div className="empty-state">
            <p className="empty-title">物件が登録されていません</p>
            <p className="empty-desc">「物件を登録」ボタンから最初の物件を追加しましょう</p>
            <button onClick={handleAddClick} className="btn-primary">物件を登録する</button>
          </div>
        )}

        {/* 物件カードグリッド */}
        {!loading && !error && properties.length > 0 && (
          <div className="property-grid">
            {properties.map((property) => (
              <div key={property.id} className="property-card">
                {/* 物件ヘッダー部分（間取り表示） */}
                <div className="property-image">
                  <span className="property-rooms">{property.layout}</span>
                </div>

                {/* 物件情報 */}
                <div className="property-body">
                  <h3 className="property-name">{property.name}</h3>
                  <p className="property-area">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {property.area}
                  </p>
                  <p className="property-rent">
                    <span className="rent-amount">{formatRent(property.rent)}</span>
                    <span className="rent-unit">/ 月</span>
                  </p>

                  {/* 編集・削除ボタン */}
                  <div className="card-actions">
                    <button
                      onClick={() => handleEditClick(property)}
                      className="btn-card-edit"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(property)}
                      className="btn-card-delete"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 物件登録・編集モーダル */}
      {showForm && (
        <PropertyForm
          initialData={editTarget}
          onSave={handleSave}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  )
}
