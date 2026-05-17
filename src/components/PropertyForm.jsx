import { useState, useEffect } from 'react'

// 選択できる間取りの選択肢
const LAYOUT_OPTIONS = ['1K', '1DK', '1LDK', '2K', '2DK', '2LDK', '3DK', '3LDK', '4LDK以上']

// 初期フォーム状態
const INITIAL_FORM = { name: '', rent: '', area: '', layout: '1K' }

/**
 * 物件の新規登録・編集を行うモーダルフォーム
 * initialData が null のとき新規登録モード、object のとき編集モード
 */
export default function PropertyForm({ initialData, onSave, onCancel }) {
  const isEdit = initialData !== null
  const [form, setForm] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 編集モードのときは既存データをフォームにセット
  useEffect(() => {
    if (isEdit) {
      setForm({
        name:   initialData.name,
        rent:   String(initialData.rent),
        area:   initialData.area,
        layout: initialData.layout,
      })
    }
  }, [initialData])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // 家賃のバリデーション
    const rentNum = parseInt(form.rent, 10)
    if (isNaN(rentNum) || rentNum <= 0) {
      setError('家賃は1以上の整数で入力してください')
      return
    }

    setLoading(true)
    const result = await onSave({
      name:   form.name.trim(),
      rent:   rentNum,
      area:   form.area.trim(),
      layout: form.layout,
    })

    // 親コンポーネントからエラーが返ってきた場合に表示
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    // モーダルの背景オーバーレイ
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? '物件を編集' : '物件を登録'}</h2>
          <button className="modal-close" onClick={onCancel} aria-label="閉じる">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <p className="form-error">{error}</p>}

          <div className="form-group">
            <label className="form-label" htmlFor="name">物件名</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-input"
              value={form.name}
              onChange={handleChange}
              placeholder="例: 渋谷プレミアムタワー"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="rent">家賃（円）</label>
              <input
                id="rent"
                name="rent"
                type="number"
                className="form-input"
                value={form.rent}
                onChange={handleChange}
                placeholder="例: 120000"
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="layout">間取り</label>
              <select
                id="layout"
                name="layout"
                className="form-input"
                value={form.layout}
                onChange={handleChange}
              >
                {LAYOUT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="area">エリア名</label>
            <input
              id="area"
              name="area"
              type="text"
              className="form-input"
              value={form.area}
              onChange={handleChange}
              placeholder="例: 東京都渋谷区"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              キャンセル
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? '保存中...' : isEdit ? '更新する' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
