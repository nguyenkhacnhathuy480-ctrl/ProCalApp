import React from 'react';
import { HistoryItem } from '../types';
import { formatCurrency, formatPercent } from '../utils/calculations';
import { Trash2, Download, Search, FileX } from 'lucide-react';
import { AdBanner } from './AdBanner';

interface HistoryViewProps {
  history: HistoryItem[];
  onClear: () => void;
  onExport: () => void;
  isPro: boolean;
  onUnlock: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, onClear, onExport, isPro, onUnlock }) => {
  
  if (!isPro) {
    return (
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl shadow-sm border border-slate-100 mt-4 mb-4">
          <div className="bg-slate-100 p-4 rounded-full mb-4">
            <FileX size={48} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Lịch sử bị khóa</h3>
          <p className="text-slate-500 mb-6">Nâng cấp lên PRO để lưu tính toán và xuất ra Excel/CSV.</p>
          <button 
            onClick={onUnlock}
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
          >
            Mở khóa tính năng PRO
          </button>
        </div>
        
        {/* Ad visible on locked screen */}
        <AdBanner />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
          <Search size={32} className="text-slate-400" />
        </div>
        <p className="text-slate-500 font-medium">Chưa có lịch sử tính toán.</p>
        <p className="text-slate-400 text-sm mt-1">Các tính toán đã lưu sẽ xuất hiện ở đây.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-center mb-2 px-1">
        <h2 className="text-lg font-bold text-slate-800">Đã lưu ({history.length})</h2>
        <div className="flex space-x-2">
          <button 
            onClick={onExport}
            className="flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors"
          >
            <Download size={14} className="mr-1.5" />
            CSV
          </button>
          <button 
            onClick={onClear}
            className="flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
          >
            <Trash2 size={14} className="mr-1.5" />
            Xóa
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {history.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-slate-800">{item.productName}</h4>
              <p className="text-xs text-slate-400">{new Date(item.date).toLocaleString('vi-VN')}</p>
              <div className="flex gap-3 mt-1 text-xs">
                 <span className="text-slate-500">Vốn: {formatCurrency(Number(item.inputs.purchasePrice))}</span>
                 <span className="text-slate-500">Bán: {formatCurrency(Number(item.inputs.sellingPrice))}</span>
              </div>
            </div>
            <div className="text-right">
              <div className={`font-bold text-lg ${item.result.isLoss ? 'text-red-500' : 'text-green-600'}`}>
                {formatCurrency(item.result.profit)}
              </div>
              <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block ${item.result.isLoss ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {item.result.margin.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};