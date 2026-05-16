import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

// ダミーの物件データ
const DUMMY_PROPERTIES = [
  { id: 1, name: '渋谷プレミアムタワー', rent: 280000, area: '東京都渋谷区', size: 62.5, rooms: '2LDK', tag: '人気' },
  { id: 2, name: '新宿グランドマンション', rent: 95000, area: '東京都新宿区', size: 25.3, rooms: '1K', tag: '新着' },
  { id: 3, name: '品川シービューレジデンス', rent: 450000, area: '東京都品川区', size: 95.2, rooms: '3LDK', tag: '高層' },
  { id: 4, name: '恵比寿スタイルアパート', rent: 165000, area: '東京都渋谷区恵比寿', size: 42.0, rooms: '1LDK', tag: '' },
  { id: 5, name: '池袋コンフォートマンション', rent: 130000, area: '東京都豊島区', size: 48.6, rooms: '2DK', tag: '駅近' },
  { id: 6, name: '秋葉原モダンレジデンス', rent: 85000, area: '東京都千代田区', size: 22.8, rooms: '1K', tag: '新着' },
  { id: 7, name: '目黒リバーサイドコート', rent: 210000, area: '東京都目黒区', size: 55.0, rooms: '2LDK', tag: '川沿い' },
  { id: 8, name: '上野パークビューハイツ', rent: 120000, area: '東京都台東区', size: 38.4, rooms: '1LDK', tag: '' },
  { id: 9, name: '六本木ラグジュアリースイート', rent: 580000, area: '東京都港区六本木', size: 110.0, rooms: '3LDK', tag: '高級' },
]

// 家賃を「〇万円」形式にフォーマット
function formatRent(rent) {
  return `${(rent / 10000).toFixed(rent % 10000 === 0 ? 0 : 1)}万円`
}

export default function PropertiesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

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
            <button onClick={handleLogout} className="btn-logout">
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="main">
        <div className="page-title-area">
          <h2 className="page-title">物件一覧</h2>
          <span className="property-count">{DUMMY_PROPERTIES.length}件</span>
        </div>

        {/* 物件カードグリッド */}
        <div className="property-grid">
          {DUMMY_PROPERTIES.map((property) => (
            <div key={property.id} className="property-card">
              {/* 物件画像プレースホルダー */}
              <div className="property-image">
                <span className="property-rooms">{property.rooms}</span>
                {property.tag && <span className="property-tag">{property.tag}</span>}
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
                <p className="property-size">{property.size} m²</p>
                <p className="property-rent">
                  <span className="rent-amount">{formatRent(property.rent)}</span>
                  <span className="rent-unit">/ 月</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
