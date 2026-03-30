import InventoryList from "@/components/InventoryList";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-gray-900 font-sans selection:bg-orange-200">
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-5 shadow-md sticky top-0 z-10">
        <div className="container mx-auto max-w-7xl flex items-center gap-3">
          <span className="text-3xl">🍪</span>
          <h1 className="text-2xl font-bold tracking-wide text-white">クッキー在庫管理</h1>
        </div>
      </header>
      
      {/* メインコンテンツ */}
      <main className="container mx-auto p-4 md:p-6 max-w-7xl">
        <p className="text-gray-500 mb-8 max-w-2xl">
          各製造フェーズごとの在庫状況です。完成品だけでなく、原材料やストック用の生地もリアルタイムでトラッキングします。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8">
          
          {/* 1. 原材料 */}
          <section className="bg-white/50 rounded-2xl p-4 shadow-sm border border-orange-50">
            <div className="flex items-center gap-2 mb-4 border-b-2 border-amber-200 pb-3">
              <span className="text-2xl">📦</span>
              <h2 className="text-xl font-bold text-gray-800">原材料</h2>
            </div>
            <InventoryList category="material" />
          </section>
          
          {/* 2. 生地 */}
          <section className="bg-white/50 rounded-2xl p-4 shadow-sm border border-orange-50">
            <div className="flex items-center gap-2 mb-4 border-b-2 border-orange-200 pb-3">
              <span className="text-2xl">🥣</span>
              <h2 className="text-xl font-bold text-gray-800">仕込み生地</h2>
            </div>
            <InventoryList category="dough" />
          </section>
          
          {/* 3. 冷凍クッキー */}
          <section className="bg-white/50 rounded-2xl p-4 shadow-sm border border-orange-50">
            <div className="flex items-center gap-2 mb-4 border-b-2 border-cyan-200 pb-3">
              <span className="text-2xl">❄️</span>
              <h2 className="text-xl font-bold text-gray-800">冷凍ストック</h2>
            </div>
            <InventoryList category="frozen" />
          </section>
          
          {/* 4. 完成品 */}
          <section className="bg-white/50 rounded-2xl p-4 shadow-sm border border-orange-50">
            <div className="flex items-center gap-2 mb-4 border-b-2 border-yellow-300 pb-3">
              <span className="text-2xl">🛍️</span>
              <h2 className="text-xl font-bold text-gray-800">完成品・店頭</h2>
            </div>
            <InventoryList category="finished" />
          </section>

        </div>
      </main>
    </div>
  );
}
