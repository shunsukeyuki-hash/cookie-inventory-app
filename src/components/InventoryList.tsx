"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

type InventoryItem = {
  id: string;
  name: string;
  category: "material" | "dough" | "frozen" | "finished";
  quantity: number;
  unit: string;
};

// 個別のアイテム行コンポーネント
function InventoryItemRow({
  item,
  onUpdateQuantity,
  onEditDetails,
  onDelete,
}: {
  item: InventoryItem;
  onUpdateQuantity: (id: string, newQuantity: number) => Promise<void>;
  onEditDetails: (id: string, newName: string, newUnit: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [inputValue, setInputValue] = useState(item.quantity.toString());
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editUnit, setEditUnit] = useState(item.unit);

  // 外部からの在庫数更新を同期
  useEffect(() => {
    setInputValue(item.quantity.toString());
  }, [item.quantity]);

  // 在庫数の直接入力保存
  const handleQuantitySave = () => {
    const val = parseInt(inputValue, 10);
    if (!isNaN(val) && val >= 0) {
      if (val !== item.quantity) {
        onUpdateQuantity(item.id, val);
      }
    } else {
      setInputValue(item.quantity.toString());
    }
  };

  const handleQuantityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  const incrementBy = (change: number) => {
    const newVal = Math.max(0, item.quantity + change);
    onUpdateQuantity(item.id, newVal);
  };

  // 編集モードの保存
  const handleEditSave = () => {
    if (!editName.trim()) return;
    onEditDetails(item.id, editName, editUnit);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="bg-white p-4 rounded-xl shadow-sm border border-orange-200 flex flex-col gap-3">
        <label className="text-sm font-bold text-gray-700">名前</label>
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
        />
        <label className="text-sm font-bold text-gray-700">単位</label>
        <input
          type="text"
          value={editUnit}
          onChange={(e) => setEditUnit(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-orange-400 focus:outline-none"
        />
        <div className="flex gap-2 mt-2 justify-end">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleEditSave}
            className="px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 rounded-lg font-medium transition-colors"
          >
            保存する
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3 transition-all hover:shadow-md relative">
      <div className="flex justify-between items-start border-b border-gray-50 pb-2">
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 text-lg">{item.name}</span>
          {/* マウスオーバー時に表示される編集と削除ボタン */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-3 mt-1 text-sm">
            <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
              <span>📝</span>編集
            </button>
            <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1">
              <span>🗑️</span>削除
            </button>
          </div>
        </div>
        
        {/* 直接入力エリア */}
        <div className="flex items-center min-w-[140px] justify-end">
          <input
            type="number"
            min="0"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleQuantitySave}
            onKeyDown={handleQuantityKeyDown}
            className="w-24 text-right text-2xl font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-orange-400 mr-2 transition-all"
            aria-label={`${item.name}の数量`}
          />
          <span className="text-sm text-gray-500 font-medium w-6 shrink-0">{item.unit}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-1">
        {/* ±1 の微調整ボタン */}
        <div className="flex bg-gray-50 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <button
            onClick={() => incrementBy(-1)}
            className="w-12 h-10 flex items-center justify-center bg-white hover:bg-red-50 text-red-600 font-bold text-xl border-r border-gray-200 transition-colors active:bg-red-100"
            aria-label="減らす"
          >
            -
          </button>
          <button
            onClick={() => incrementBy(1)}
            className="w-12 h-10 flex items-center justify-center bg-white hover:bg-green-50 text-green-600 font-bold text-xl transition-colors active:bg-green-100"
            aria-label="増やす"
          >
            +
          </button>
        </div>
        
        {/* 大きな数値の変更ボタン */}
        <div className="flex space-x-2">
           <button
            onClick={() => incrementBy(-10)}
            className="px-3 py-2 text-sm font-bold bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors border border-red-100"
            aria-label="10減らす"
          >
            -10
          </button>
          <button
            onClick={() => incrementBy(10)}
            className="px-3 py-2 text-sm font-bold bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg transition-colors shadow-sm border border-orange-200"
            aria-label="10増やす"
          >
            +10
          </button>
        </div>
      </div>
    </li>
  );
}

export default function InventoryList({ category }: { category: string }) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 新規追加フォームの状態
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newQuantity, setNewQuantity] = useState("0");
  const [newUnit, setNewUnit] = useState("g");

  useEffect(() => {
    fetchItems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .eq("category", category)
      .order("last_updated", { ascending: true }); // 名前順より作成順の方が見やすい場合がある

    if (error) {
      console.error("Error fetching items:", error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  // 数量（在庫）のみ更新
  const updateQuantity = async (id: string, newQuantity: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
    const { error } = await supabase
      .from("inventory_items")
      .update({ quantity: newQuantity, last_updated: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      toast.error("在庫の更新に失敗しました");
      fetchItems();
    } else {
      toast.success("在庫を更新しました");
    }
  };

  // アイテム名・単位の更新
  const editDetails = async (id: string, newName: string, newUnit: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: newName, unit: newUnit } : item))
    );
    const { error } = await supabase
      .from("inventory_items")
      .update({ name: newName, unit: newUnit, last_updated: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      toast.error("アイテムの更新に失敗しました");
      fetchItems();
    } else {
      toast.success("アイテムを更新しました");
    }
  };

  // アイテムの削除
  const deleteItem = async (id: string) => {
    const isConfirmed = window.confirm("本当にこのアイテムを削除しますか？");
    if (!isConfirmed) return;

    setItems((prev) => prev.filter((item) => item.id !== id));
    const { error } = await supabase.from("inventory_items").delete().eq("id", id);
    if (error) {
      toast.error("削除に失敗しました");
      fetchItems();
    } else {
      toast.success("削除しました");
    }
  };

  // アイテムの新規作成
  const addItem = async () => {
    if (!newName.trim()) return;
    const qty = parseInt(newQuantity, 10);
    const validQty = isNaN(qty) || qty < 0 ? 0 : qty;

    const newItem = {
      name: newName,
      category: category as any,
      quantity: validQty,
      unit: newUnit,
    };

    // DBに追加し、生成されたIDごと結果を受け取る
    const { data, error } = await supabase
      .from("inventory_items")
      .insert(newItem)
      .select()
      .single();

    if (!error && data) {
      setItems((prev) => [...prev, data]);
      setIsAdding(false);
      setNewName("");
      setNewQuantity("0");
      toast.success("アイテムを追加しました");
    } else {
      console.error("Error adding item:", error);
      toast.error("アイテムの追加に失敗しました。");
    }
  };

  if (loading) {
    return <div className="p-4 text-sm text-gray-500 animate-pulse bg-white rounded-lg shadow-sm">データを読み込み中...</div>;
  }

  // カテゴリに応じたデフォルト単位のプレースホルダーなど
  const defaultUnit = category === "material" || category === "dough" ? "g" : "枚";

  return (
    <div className="flex flex-col gap-4">
      <ul className="space-y-3">
        {items.length === 0 ? (
          <li className="p-4 text-sm text-gray-500 bg-white rounded-lg shadow-sm border border-gray-100 text-center">アイテムがありません</li>
        ) : (
          items.map((item) => (
            <InventoryItemRow
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onEditDetails={editDetails}
              onDelete={deleteItem}
            />
          ))
        )}
      </ul>

      {/* 新規追加セクション */}
      {isAdding ? (
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 flex flex-col gap-3 mt-2 shadow-inner">
          <div>
            <label className="text-sm font-bold text-gray-700 block mb-1">新しいアイテム名</label>
            <input
              type="text"
              placeholder="例: クルミ"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-bold text-gray-700 block mb-1">初期在庫</label>
              <input
                type="number"
                min="0"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none text-right"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-bold text-gray-700 block mb-1">単位</label>
              <input
                type="text"
                placeholder={`例: ${defaultUnit}`}
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setIsAdding(false)}
              className="flex-1 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-bold transition-colors shadow-sm"
            >
              キャンセル
            </button>
            <button
              onClick={addItem}
              disabled={!newName.trim()}
              className="flex-1 py-2 bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold transition-colors shadow-sm"
            >
              追加する
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            setIsAdding(true);
            setNewUnit(defaultUnit);
          }}
          className="w-full mt-2 py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 font-bold flex justify-center items-center gap-2 transition-all"
        >
          <span className="text-xl">＋</span> 新しいアイテムを追加
        </button>
      )}
    </div>
  );
}
