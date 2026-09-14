import React from 'react';

const PERFORMANCE_DATA = [
  {
    name: 'Random Forest (RF)',
    accuracy: '96.5%',
    precision: '96.1%',
    recall: '96.7%',
    f1Score: '96.4%',
    isRecommended: true,
  },
  {
    name: 'Decision Tree (DT)',
    accuracy: '93.8%',
    precision: '93.5%',
    recall: '93.9%',
    f1Score: '93.7%',
    isRecommended: false,
  }
];

export default function ModelPerformanceTable() {
  return (
    <div className="px-4">
      <div className="bg-white border border-slate-200 rounded-xl p-6 relative text-left shadow-xs hover:border-slate-300 transition-colors">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-1">Perbandingan Performa Algoritma ML</h4>
            <p className="text-xs text-slate-400 font-medium" title="Evaluasi model menggunakan pengujian 10-Fold Cross Validation">Metrik evaluasi model klasifikasi Hipertensi AI (10-Fold CV)</p>
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto w-full border border-slate-200 rounded-xl bg-white shadow-xs">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-[#f8fafc]/90 border-b border-slate-200 select-none">
              <tr>
                <th className="py-3.5 px-6 text-[10px] font-bold text-slate-450 uppercase tracking-wider w-5/12">Nama Algoritma Model</th>
                <th className="py-3.5 px-6 text-[10px] font-bold text-slate-450 uppercase tracking-wider text-center">Akurasi</th>
                <th className="py-3.5 px-6 text-[10px] font-bold text-slate-450 uppercase tracking-wider text-center">Presisi</th>
                <th className="py-3.5 px-6 text-[10px] font-bold text-slate-450 uppercase tracking-wider text-center">Recall (Sensitivitas)</th>
                <th className="py-3.5 px-6 text-[10px] font-bold text-slate-450 uppercase tracking-wider text-center">F1-Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {PERFORMANCE_DATA.map((row) => (
                <tr 
                  key={row.name}
                  className={`hover:bg-slate-50/50 transition-colors ${row.isRecommended ? 'bg-slate-50/80' : ''}`}
                >
                  <td className="py-4.5 px-6 text-xs text-slate-900 flex items-center gap-2 select-text">
                    <span className="font-extrabold">{row.name}</span>
                    {row.isRecommended && (
                      <span 
                        className="text-[11px] font-semibold text-slate-500 cursor-help select-none"
                        title="Model dengan nilai akurasi dan F1-Score tertinggi"
                      >
                        (Rekomendasi)
                      </span>
                    )}
                  </td>
                  <td className="py-4.5 px-6 text-center select-none">
                    <span className="text-xs font-black text-slate-900">
                      {row.accuracy}
                    </span>
                  </td>
                  <td className="py-4.5 px-6 text-center select-none text-xs font-bold text-slate-800">{row.precision}</td>
                  <td className="py-4.5 px-6 text-center select-none text-xs font-bold text-slate-800">{row.recall}</td>
                  <td className="py-4.5 px-6 text-center select-none text-xs font-bold text-slate-800">{row.f1Score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

