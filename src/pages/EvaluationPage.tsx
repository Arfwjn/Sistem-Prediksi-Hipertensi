import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, TreeDeciduous, Trees, TrendingUp, Target, Crosshair, Award, Info, ChevronDown } from 'lucide-react';

// Dummy evaluation data
const evaluationData = {
  decisionTree: {
    name: 'Decision Tree',
    icon: TreeDeciduous,
    color: 'blue',
    accuracy: 89.2,
    precision: 87.5,
    recall: 88.1,
    f1Score: 87.8,
    description: 'Model klasifikasi berbasis pohon keputusan yang membagi data secara rekursif berdasarkan fitur terbaik.',
  },
  randomForest: {
    name: 'Random Forest',
    icon: Trees,
    color: 'emerald',
    accuracy: 94.7,
    precision: 93.2,
    recall: 94.0,
    f1Score: 93.6,
    description: 'Ensemble dari banyak decision tree untuk meningkatkan akurasi dan mengurangi overfitting.',
  },
};

const metrics = [
  { key: 'accuracy' as const, label: 'Akurasi', icon: Target, description: 'Persentase prediksi benar dari seluruh prediksi' },
  { key: 'precision' as const, label: 'Presisi', icon: Crosshair, description: 'Ketepatan prediksi positif terhadap seluruh prediksi positif' },
  { key: 'recall' as const, label: 'Recall', icon: TrendingUp, description: 'Kemampuan model mendeteksi seluruh kasus positif' },
  { key: 'f1Score' as const, label: 'F1-Score', icon: Award, description: 'Rata-rata harmonis dari presisi dan recall' },
];

type MetricKey = 'accuracy' | 'precision' | 'recall' | 'f1Score';

// Animated progress bar component
function MetricBar({ value, color, delay }: { value: number; color: string; delay: number }) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
  };
  return (
    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, delay, ease: 'easeOut' }}
        className={`h-full rounded-full ${colorClasses[color]}`}
      />
    </div>
  );
}

export default function EvaluationPage() {
  const [expandedModel, setExpandedModel] = useState<string | null>(null);

  const dt = evaluationData.decisionTree;
  const rf = evaluationData.randomForest;

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fadeIn select-none pb-12">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4"
      >
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Hasil Evaluasi Model</h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Perbandingan performa Decision Tree vs Random Forest</p>
            </div>
          </div>
          <div className="mt-3 p-3 bg-amber-50/60 border border-amber-100 rounded-xl flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
              Data evaluasi di bawah menggunakan <strong>data dummy</strong>. Hasil akan diperbarui setelah model machine learning selesai dilatih dengan dataset aktual.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Model Overview Card (Combined) */}
      <div className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm cursor-pointer transition-all hover:shadow-md"
          onClick={() => setExpandedModel(expandedModel ? null : 'models')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800">Ringkasan Model</h2>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Decision Tree & Random Forest</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-full bg-blue-500 text-white text-[10px] font-bold">
                DT {dt.accuracy}%
              </div>
              <div className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                RF {rf.accuracy}%
              </div>
              <motion.div animate={{ rotate: expandedModel ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </motion.div>
            </div>
          </div>

          <AnimatePresence>
            {expandedModel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                  {/* Decision Tree */}
                  <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <TreeDeciduous className="w-4 h-4 text-blue-700" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-blue-700">Decision Tree</h3>
                        <p className="text-[9px] text-slate-500 font-medium">{dt.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {metrics.map((m) => (
                        <div key={m.key} className="bg-white/70 rounded-lg p-2.5 border border-blue-100/50">
                          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">{m.label}</p>
                          <p className="text-base font-bold text-blue-700 mt-0.5">{dt[m.key]}%</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Random Forest */}
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Trees className="w-4 h-4 text-emerald-700" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-emerald-700">Random Forest</h3>
                        <p className="text-[9px] text-slate-500 font-medium">{rf.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {metrics.map((m) => (
                        <div key={m.key} className="bg-white/70 rounded-lg p-2.5 border border-emerald-100/50">
                          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">{m.label}</p>
                          <p className="text-base font-bold text-emerald-700 mt-0.5">{rf[m.key]}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Full Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-4"
      >
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800">Tabel Perbandingan Model</h2>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Decision Tree vs Random Forest — Semua metrik evaluasi</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3.5">Metrik</th>
                  <th className="text-center text-[11px] font-bold text-blue-600 uppercase tracking-wider px-5 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <TreeDeciduous className="w-3.5 h-3.5" />
                      Decision Tree
                    </div>
                  </th>
                  <th className="text-center text-[11px] font-bold text-emerald-600 uppercase tracking-wider px-5 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <Trees className="w-3.5 h-3.5" />
                      Random Forest
                    </div>
                  </th>
                  <th className="text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3.5">Selisih</th>
                  <th className="text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3.5">Unggul</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.map((metric, idx) => {
                  const dtVal = dt[metric.key];
                  const rfVal = rf[metric.key];
                  const diff = Math.abs(rfVal - dtVal).toFixed(1);
                  const winner = rfVal > dtVal ? 'Random Forest' : dtVal > rfVal ? 'Decision Tree' : 'Sama';
                  const winnerColor = winner === 'Random Forest' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : winner === 'Decision Tree' ? 'text-blue-600 bg-blue-50 border-blue-100' : 'text-slate-500 bg-slate-50 border-slate-100';

                  return (
                    <motion.tr
                      key={metric.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.08 }}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <metric.icon className="w-4 h-4 text-slate-400" />
                          <div>
                            <span className="text-sm font-semibold text-slate-800">{metric.label}</span>
                            <p className="text-[10px] text-slate-400 font-medium">{metric.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="text-sm font-bold text-blue-600">{dtVal}%</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="text-sm font-bold text-emerald-600">{rfVal}%</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="text-xs font-bold text-slate-600">{diff}%</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${winnerColor}`}>
                          {winner}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary footer */}
          <div className="p-5 bg-slate-50/50 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Award className="w-4 h-4 text-emerald-500" />
              <span>
                Model <strong className="text-emerald-600">Random Forest</strong> menunjukkan performa lebih unggul di semua metrik evaluasi dengan rata-rata selisih{' '}
                <strong className="text-emerald-600">
                  +{(
                    ((rf.accuracy - dt.accuracy) + (rf.precision - dt.precision) + (rf.recall - dt.recall) + (rf.f1Score - dt.f1Score)) / 4
                  ).toFixed(1)}%
                </strong>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
