import React from 'react';
import { motion } from 'motion/react';
import { Activity, BrainCircuit, HeartPulse } from 'lucide-react';
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
}

export default function PredictionResult({ result, confidence, accuracyDT, accuracyRF }: PredictionResultProps) {
  if (result === null || confidence === null) {
    return (
      <EmptyState
        theme="light"
        className="h-full min-h-[480px] border-slate-200 p-6"
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
        <div className="text-left space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Akurasi Decision Tree</span>
          <span className="text-sm font-extrabold text-slate-800">{accuracyDT ?? confidence}%</span>
          <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${accuracyDT ?? confidence}%` }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
              className="bg-blue-600 h-1.5 rounded-full"
            />
          </div>
        </div>
        <div className="text-left space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Akurasi Random Forest</span>
          <span className="text-sm font-extrabold text-slate-800">{accuracyRF ?? confidence}%</span>
          <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${accuracyRF ?? confidence}%` }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
              className="bg-emerald-600 h-1.5 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* High fidelity inline SVG Circular score graph */}
      <ConfidenceGauge confidence={confidence} result={result} />

      {/* 4-bar Stage Indicator */}
      <StageIndicator result={result} />
    </GlowCard>
  );
}

