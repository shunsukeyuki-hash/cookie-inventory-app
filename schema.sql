-- 在庫アイテム用テーブルの作成
CREATE TABLE inventory_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('material', 'dough', 'frozen', 'finished')),
  quantity NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- データ取得のためのセキュリティルールの設定（テスト用ですべて許可）
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON inventory_items FOR SELECT USING (true);
CREATE POLICY "Public Insert Access" ON inventory_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON inventory_items FOR UPDATE USING (true);
CREATE POLICY "Public Delete Access" ON inventory_items FOR DELETE USING (true);

-- 初期テストデータ（モックデータ）の挿入
INSERT INTO inventory_items (name, category, quantity, unit) VALUES
('小麦粉', 'material', 50000, 'g'),
('砂糖', 'material', 20000, 'g'),
('バター', 'material', 15000, 'g'),
('チョコチップ', 'material', 10000, 'g'),
('プレーン生地', 'dough', 5000, 'g'),
('チョコ生地', 'dough', 3000, 'g'),
('冷凍クッキー（プレーン）', 'frozen', 150, '枚'),
('冷凍クッキー（チョコ）', 'frozen', 100, '枚'),
('焼き上がりクッキー（プレーン）', 'finished', 50, '枚'),
('焼き上がりクッキー（チョコ）', 'finished', 30, '枚');
