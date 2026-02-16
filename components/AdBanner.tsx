import React from 'react';

export const AdBanner: React.FC = () => {
  return (
    <div className="w-full my-6 mx-auto overflow-hidden animate-in fade-in duration-700">
        {/* ================================================================================== */}
        {/* KHU VỰC DÁN MÃ QUẢNG CÁO (GOOGLE ADSENSE / CUSTOM HTML) */}
        {/* ================================================================================== */}
        
        {/* Ví dụ mã Google AdSense:
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot="XXXXXXXXXX"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script> 
        */}

        {/* --- Placeholder hiển thị khi chưa có mã quảng cáo (Xóa phần này khi chạy thật) --- */}
        <div className="bg-slate-100 border-2 border-slate-200 border-dashed rounded-xl w-full h-[120px] flex flex-col items-center justify-center text-slate-400 relative overflow-hidden group hover:bg-slate-50 transition-colors cursor-pointer">
            
            <div className="absolute top-0 left-0 bg-slate-200 text-[9px] px-1.5 py-0.5 rounded-br font-bold text-slate-500 uppercase">
                Quảng cáo
            </div>

            <div className="text-center z-10">
                <span className="text-sm font-bold tracking-wider text-slate-500 block mb-1">KHÔNG GIAN QUẢNG CÁO</span>
                <span className="text-[10px] text-slate-400">Đặt banner của bạn tại đây</span>
            </div>
            
            {/* Pattern background */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ 
                backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', 
                backgroundSize: '10px 10px' 
            }}></div>
        </div>
        {/* ================================================================================== */}
    </div>
  );
};