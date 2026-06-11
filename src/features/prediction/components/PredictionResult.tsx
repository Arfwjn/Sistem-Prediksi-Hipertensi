import React from 'react';
import { motion } from 'motion/react';
import { Activity, BrainCircuit, HeartPulse, UserPlus, CheckCircle } from 'lucide-react';
import ConfidenceGauge from './ConfidenceGauge';
import StageIndicator from './StageIndicator';
import { HypertensionLevel } from '../../../utils/hypertension';
import { GlowCard } from '../../../components/ui/spotlight-card';
import { EmptyState } from '../../../components/ui/interactive-empty-state';

interface PredictionResultProps {
  result: HypertensionLevel | null;
  confidence: number | null;
  accuracyDT?: number | null;
  accuracyRF?: number | null;
  
  patientType: 'registered' | 'new';
  patientName: string;
  isSaved: boolean;
  onSavePatient: () => void;
  isSaving?: boolean;
}

export default function PredictionResult({
  result,
  confidence,
  accuracyDT,
  accuracyRF,
  patientType,
  patientName,
  isSaved,
  onSavePatient,
  isSaving,
}: PredictionResultProps) {
  if (result === null || confidence === null) {
    return (
      <EmptyState
        theme="light"
        className="h-full min-h-[480px] bg-white border border-solid border-slate-200 rounded-2xl shadow-[0_6px_35px_rgba(0,0,0,0.04)] hover:bg-white hover:border-slate-200 hover:shadow-[0_6px_35px_rgba(0,0,0,0.04)] p-6"
        title="Menunggu Proses Klasifikasi"
        description="Silakan isi data klinis di sebelah kiri, lalu klik Proses Klasifikasi."
        icons={[
          <HeartPulse key="e1" className="w-6 h-6 text-red-500" />,
          <BrainCircuit key="e2" className="w-7 h-7 text-blue-600" />,
          <Activity key="e3" className="w-6 h-6 text-emerald-500" />
        ]}
      />
    );
  }

  const getGlowColor = (): 'green' | 'orange' | 'red' | 'blue' => {
    if (result === 'Normal') return 'green';
    if (result === 'Pra Hipertensi' || result === 'Tingkat 1') return 'orange';
    return 'red';
  };

  return (
    <GlowCard 
      className="p-6 md:p-8 flex flex-col justify-center gap-5 text-center h-full min-h-[480px]"
      glowColor={getGlowColor()}
      customSize={true}
    >
      <div className="mb-4">
        <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold border rounded-full shadow-sm
          ${result === 'Normal' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
            result === 'Pra Hipertensi' ? 'bg-amber-50 border-amber-200 text-amber-800' :
            result === 'Tingkat 1' ? 'bg-orange-50 border-orange-200 text-orange-850' : 'bg-red-50 border-red-200 text-red-800'}`}
        >
          <Activity className="w-3.5 h-3.5" />
          Hipertensi {result}
        </span>
      </div>

      <motion.h2 
        key={result}
        initial={{ scale: 0.95, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-4xl font-extrabold text-slate-900 tracking-tight"
      >
        {result}
      </motion.h2>
      
      {/* Individual Model Accuracies Grid */}
      <div className="grid grid-cols-2 gap-4 mt-4 mb-2 p-3 bg-slate-50/80 rounded-xl border border-slate-200/40 select-none">
        {/* Decision Tree Card */}
        <div className="text-left space-y-1.5 p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
          <span className="text-[10px] font-black text-blue-600 block uppercase tracking-wider">Decision Tree</span>
          <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
            <span>Akurasi:</span>
            <span className="font-extrabold text-slate-800">93.8%</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
            <span>Confidence:</span>
            <span className="font-extrabold text-slate-800">{accuracyDT ?? confidence}%</span>
          </div>
          <div className="w-full bg-slate-150 rounded-full h-1 overflow-hidden mt-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${accuracyDT ?? confidence}%` }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
              className="bg-blue-600 h-1 rounded-full"
            />
          </div>
        </div>

        {/* Random Forest Card */}
        <div className="text-left space-y-1.5 p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
          <span className="text-[10px] font-black text-emerald-600 block uppercase tracking-wider">Random Forest</span>
          <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
            <span>Akurasi:</span>
            <span className="font-extrabold text-slate-800">96.5%</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
            <span>Confidence:</span>
            <span className="font-extrabold text-slate-800">{accuracyRF ?? confidence}%</span>
          </div>
          <div className="w-full bg-slate-150 rounded-full h-1 overflow-hidden mt-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${accuracyRF ?? confidence}%` }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
              className="bg-emerald-600 h-1 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* High fidelity inline SVG Circular score graph */}
      <ConfidenceGauge confidence={confidence} result={result} />

      {/* 4-bar Stage Indicator */}
      <StageIndicator result={result} />

      {/* Quick register new patient action button post-classification */}
      {patientType === 'new' && (
        <div className="mt-2 pt-4 border-t border-slate-100 flex flex-col items-center justify-center w-full">
          {!isSaved ? (
            <button
              onClick={onSavePatient}
              disabled={isSaving}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan ke Database...' : 'Daftarkan Pasien & Simpan Riwayat'}</span>
            </button>
          ) : (
            <div className="w-full py-2.5 px-4 bg-emerald-50 border border-emerald-200 text-emerald-850 font-bold text-xs rounded-xl flex items-center justify-center gap-2 select-none shadow-sm">
              <CheckCircle className="w-4.5 h-4.5 text-emerald-650" />
              <span>Pasien & Riwayat Berhasil Disimpan</span>
            </div>
          )}
        </div>
      )}
    </GlowCard>
  );
}
