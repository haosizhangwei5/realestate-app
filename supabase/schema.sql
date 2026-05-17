-- =============================================
-- 不動産管理アプリ: 物件テーブル定義
-- Supabase の SQL Editor で実行してください
-- =============================================

-- 物件テーブルの作成
CREATE TABLE IF NOT EXISTS properties (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,          -- 物件名
  rent        INTEGER     NOT NULL CHECK (rent > 0), -- 家賃（円）
  area        TEXT        NOT NULL,          -- エリア名
  layout      TEXT        NOT NULL,          -- 間取り（例: 1LDK）
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Row Level Security (RLS) の設定
-- =============================================

-- RLS を有効化（有効化しないとポリシーは機能しない）
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 【参照】自分が登録した物件のみ取得できる
CREATE POLICY "自分の物件のみ参照"
  ON properties
  FOR SELECT
  USING (auth.uid() = user_id);

-- 【登録】自分の user_id を持つレコードのみ INSERT できる
CREATE POLICY "自分の物件のみ登録"
  ON properties
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 【更新】自分が登録した物件のみ UPDATE できる
CREATE POLICY "自分の物件のみ更新"
  ON properties
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 【削除】自分が登録した物件のみ DELETE できる
CREATE POLICY "自分の物件のみ削除"
  ON properties
  FOR DELETE
  USING (auth.uid() = user_id);
