import React, { useState, useEffect, useMemo } from 'react';
import { Settings, History, Calculator, Save, Crown, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { Inputs, CalculationResult, HistoryItem, AppView } from './types';
import { calculateProfit, formatCurrency } from './utils/calculations';
import { usePro } from './hooks/usePro';
import { INITIAL_INPUTS, STORAGE_KEY_HISTORY } from './constants';
import { CalculatorInput } from './components/CalculatorInput';
import { ProModal } from './components/ProModal';
import { HistoryView } from './components/HistoryView';
import { AdBanner } from './components/AdBanner';

const App: React.FC = () => {
  const { isPro, activatePro } = usePro();
  const [view, setView] = useState<AppView>(AppView.CALCULATOR);
  const [inputs, setInputs] = useState<Inputs>(INITIAL_INPUTS);
  const [productName, setProductName] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showProModal, setShowProModal] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Load history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history when updated
  useEffect(() => {
    if (isPro) { // Only save if Pro to avoid loophole if they lose Pro status
       localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    }
  }, [history, isPro]);

  // Real-time calculation
  const results: CalculationResult = useMemo(() => calculateProfit(inputs), [inputs]);

  const handleInputChange = (field: keyof Inputs, value: number | '') => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!isPro) {
      setShowProModal(true);
      return;
    }

    if (!inputs.sellingPrice || !inputs.purchasePrice) {
      alert("Vui lòng nhập giá nhập và giá bán.");
      return;
    }

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      inputs: { ...inputs },
      result: { ...results },
      productName: productName || `Sản phẩm ${history.length + 1}`
    };

    setHistory(prev => [newItem, ...prev]);
    setProductName('');
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2000);
  };

  const handleClearHistory = () => {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả lịch sử không?')) {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    }
  };

  const handleExport = () => {
    if (!isPro) return;
    
    // Updated headers for Vietnamese
    const headers = ['Ngày', 'Tên sản phẩm', 'Giá nhập', 'Giá bán', 'Phí sàn %', 'Phí Ship', 'Quảng cáo', 'Tổng chi phí', 'Lợi nhuận', 'Tỷ suất %', 'ROI %'];
    const rows = history.map(item => [
      new Date(item.date).toLocaleDateString('vi-VN'),
      item.productName,
      item.inputs.purchasePrice,
      item.inputs.sellingPrice,
      item.inputs.platformFeePercent,
      item.inputs.shippingFee,
      item.inputs.adCost,
      item.result.totalCost.toFixed(0),
      item.result.profit.toFixed(0),
      item.result.margin.toFixed(2),
      item.result.roi.toFixed(2)
    ]);

    // Add BOM for Excel correct encoding of Vietnamese characters
    const bom = "\uFEFF";
    const csvContent = "data:text/csv;charset=utf-8," + bom
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "lich_su_loi_nhuan.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Header */}
      <header className={`sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-sm backdrop-blur-md bg-white/90 border-b border-slate-100 transition-all`}>
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <DollarSign size={20} strokeWidth={3} />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">ProfitCalc</h1>
        </div>
        {!isPro && (
          <button 
            onClick={() => setShowProModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 rounded-full text-xs font-bold shadow-sm hover:scale-105 transition-transform"
          >
            <Crown size={14} fill="currentColor" />
            <span>NÂNG CẤP</span>
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4 sm:p-6">
        
        {view === AppView.CALCULATOR && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
            
            {/* Results Card */}
            <div className={`relative overflow-hidden rounded-3xl p-6 shadow-xl transition-all duration-500 ${results.isLoss ? 'bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-red-200' : 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-indigo-200'}`}>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-indigo-100 font-medium text-sm uppercase tracking-wide">Lợi Nhuận Ròng</span>
                  <div className={`px-2 py-0.5 rounded-md text-xs font-bold ${results.isLoss ? 'bg-red-400/30 text-white' : 'bg-indigo-400/30 text-white'}`}>
                    Tỷ suất {results.margin.toFixed(1)}%
                  </div>
                </div>
                <div className="text-4xl font-extrabold tracking-tight mb-4 break-words">
                  {formatCurrency(results.profit)}
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <div className="text-indigo-100 text-xs mb-0.5">Hòa Vốn</div>
                    <div className="font-bold text-lg">{formatCurrency(results.breakEven)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-indigo-100 text-xs mb-0.5">Tổng Chi Phí</div>
                    <div className="font-bold text-lg">{formatCurrency(results.totalCost)}</div>
                  </div>
                </div>

                {results.isLoss && (
                   <div className="mt-4 flex items-center text-red-100 text-xs bg-red-900/20 p-2 rounded-lg">
                     <AlertTriangle size={14} className="mr-1.5" />
                     <span>Cảnh báo: Bán lỗ</span>
                   </div>
                )}
              </div>
              
              {/* Decorative Circles */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
            </div>

            {/* Input Form */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-5">
              
              <div className="grid grid-cols-2 gap-4">
                 <CalculatorInput 
                  id="purchase"
                  label="Giá Nhập" 
                  value={inputs.purchasePrice} 
                  onChange={(v) => handleInputChange('purchasePrice', v)}
                  suffix="₫"
                  placeholder="0"
                />
                <CalculatorInput 
                  id="sell"
                  label="Giá Bán" 
                  value={inputs.sellingPrice} 
                  onChange={(v) => handleInputChange('sellingPrice', v)}
                  suffix="₫"
                  placeholder="0"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                   <CalculatorInput 
                    id="fee"
                    label="Phí Sàn" 
                    value={inputs.platformFeePercent} 
                    onChange={(v) => handleInputChange('platformFeePercent', v)}
                    suffix="%"
                    placeholder="0"
                  />
                </div>
                <div className="col-span-2">
                   <CalculatorInput 
                    id="shipping"
                    label="Phí Ship" 
                    value={inputs.shippingFee} 
                    onChange={(v) => handleInputChange('shippingFee', v)}
                    suffix="₫"
                    placeholder="0"
                  />
                </div>
              </div>

              <CalculatorInput 
                id="ads"
                label="Chi Phí QC (Tùy chọn)" 
                value={inputs.adCost} 
                onChange={(v) => handleInputChange('adCost', v)}
                suffix="₫"
                placeholder="0"
              />

              {/* Save Section (Pseudo-Pro) */}
              <div className="pt-2">
                 {isPro && (
                   <div className="mb-3">
                     <input 
                      type="text" 
                      placeholder="Tên sản phẩm (Tùy chọn)"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full text-sm p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                     />
                   </div>
                 )}
                 <button 
                  onClick={handleSave}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all ${showSaveSuccess ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95 shadow-lg shadow-slate-200'}`}
                 >
                   {showSaveSuccess ? (
                     <span className="flex items-center"><TrendingUp size={20} className="mr-2"/> Đã Lưu!</span>
                   ) : (
                     <span className="flex items-center"><Save size={20} className="mr-2"/> Lưu Tính Toán</span>
                   )}
                 </button>
                 {!isPro && <p className="text-center text-xs text-slate-400 mt-2">Mở khóa PRO để lưu lịch sử</p>}
              </div>

            </div>
            
            {/* ADVERTISEMENT AREA (Visible only if NOT Pro) */}
            {!isPro && <AdBanner />}

          </div>
        )}

        {view === AppView.HISTORY && (
          <HistoryView 
            history={history} 
            onClear={handleClearHistory} 
            onExport={handleExport}
            isPro={isPro}
            onUnlock={() => setShowProModal(true)}
          />
        )}

        {view === AppView.SETTINGS && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-xl font-bold text-slate-800">Cài đặt</h2>
                </div>
                <div className="p-4">
                  <button onClick={() => setShowProModal(true)} className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-white rounded-xl mb-4 hover:bg-indigo-50 transition-colors">
                    <div className="flex items-center">
                       <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                         <Crown size={24} className="text-indigo-600" />
                       </div>
                       <div className="text-left">
                         <div className="font-bold text-slate-800">Trạng thái PRO</div>
                         <div className="text-xs text-slate-500">{isPro ? 'Đang hoạt động' : 'Bản miễn phí'}</div>
                       </div>
                    </div>
                    {isPro ? <span className="text-green-600 font-bold text-sm">ACTIVE</span> : <span className="text-indigo-600 font-bold text-sm">NÂNG CẤP</span>}
                  </button>

                  <div className="space-y-2">
                    <div className="p-4 rounded-xl hover:bg-slate-50 cursor-pointer flex justify-between items-center transition-colors">
                       <span className="font-medium text-slate-700">Tiền tệ</span>
                       <span className="text-slate-400 text-sm">VND (₫)</span>
                    </div>
                    <div className="p-4 rounded-xl hover:bg-slate-50 cursor-pointer flex justify-between items-center transition-colors">
                       <span className="font-medium text-slate-700">Giao diện</span>
                       <span className="text-slate-400 text-sm">Sáng</span>
                    </div>
                    <div className="p-4 rounded-xl hover:bg-slate-50 cursor-pointer flex justify-between items-center transition-colors">
                       <span className="font-medium text-slate-700">Phiên bản</span>
                       <span className="text-slate-400 text-sm">1.0.0</span>
                    </div>
                  </div>
                </div>
             </div>
             
             <div className="mt-8 text-center">
               <p className="text-xs text-slate-400">ProfitCalc App © 2024</p>
             </div>
          </div>
        )}

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-2 pb-safe-area flex justify-around items-center z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setView(AppView.CALCULATOR)}
          className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${view === AppView.CALCULATOR ? 'text-indigo-600 -translate-y-1' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Calculator size={24} strokeWidth={view === AppView.CALCULATOR ? 2.5 : 2} />
          <span className="text-[10px] font-bold mt-1">Tính toán</span>
        </button>

        <button 
          onClick={() => setView(AppView.HISTORY)}
          className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${view === AppView.HISTORY ? 'text-indigo-600 -translate-y-1' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <History size={24} strokeWidth={view === AppView.HISTORY ? 2.5 : 2} />
          <span className="text-[10px] font-bold mt-1">Lịch sử</span>
        </button>

        <button 
          onClick={() => setView(AppView.SETTINGS)}
          className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${view === AppView.SETTINGS ? 'text-indigo-600 -translate-y-1' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Settings size={24} strokeWidth={view === AppView.SETTINGS ? 2.5 : 2} />
          <span className="text-[10px] font-bold mt-1">Cài đặt</span>
        </button>
      </nav>

      {/* Modals */}
      <ProModal 
        isOpen={showProModal} 
        onClose={() => setShowProModal(false)} 
        onActivate={activatePro} 
      />
    </div>
  );
};

export default App;