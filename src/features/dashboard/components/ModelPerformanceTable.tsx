import React from 'react';
import { Cpu, ShieldCheck, Activity } from 'lucide-react';
import { GlowCard } from '../../../components/ui/spotlight-card';

const PERFORMANCE_DATA = [
  {
    name: 'Random Forest (RF)',
    accuracy: '96.5%',
    precision: '96.1%',
    recall: '96.7%',
    f1Score: '96.4%',
    isRecommended: true,
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  {
    name: 'Decision Tree (DT)',
    accuracy: '93.8%',
    precision: '93.5%',
    recall: '93.9%',
    f1Score: '93.7%',
    isRecommended: false,
    badgeColor: 'bg-slate-50 text-slate-700 border-slate-200'
  }
];

export default function ModelPerformanceTable() {
  return (
    <div className="px-4">
      <GlowCard 
        className="w-full p-6 relative text-left"
        glowColor="blue"
        customSize={true}
      >
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-1">Perbandingan Performa Algoritma ML</h4>
            <p className="text-xs text-slate-400 font-medium">Metrik evaluasi model klasifikasi Hipertensi AI</p>
          </div>
          
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200/80 rounded-xl text-[10px] font-bold text-blue-700 select-none shadow-sm">
              <Cpu className="w-3.5 h-3.5" />
              <span>Model K-Fold Evaluated</span>
            </span>
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto w-full border border-slate-100 rounded-2xl bg-white shadow-sm">
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
                  className={`hover:bg-slate-50/50 transition-colors ${row.isRecommended ? 'bg-blue-50/20' : ''}`}
                >
                  <td className="py-4.5 px-6 text-xs text-slate-900 flex items-center gap-2 select-text">
                    <span className="font-extrabold">{row.name}</span>
                    {row.isRecommended && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-600 text-white border border-blue-600 shadow-sm select-none">
                        <ShieldCheck className="w-3 h-3" />
                        Rekomendasi
                      </span>
                    )}
                  </td>
                  <td className="py-4.5 px-6 text-center select-none">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 bg-emerald-50 border border-emerald-150 text-emerald-800 rounded-lg text-xs font-bold min-w-[55px]">
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
      </GlowCard>
    </div>
  );
}
