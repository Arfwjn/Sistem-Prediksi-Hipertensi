import React from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';
import ConfidenceGauge from './ConfidenceGauge';
import StageIndicator from './StageIndicator';
import { HypertensionLevel } from '../../../utils/hypertension';

interface PredictionResultProps {
  result: HypertensionLevel;
  confidence: number;
  activeModel: string;
}

export default function PredictionResult({ result, confidence, activeModel }: PredictionResultProps) {
  return (
    <div className="p-6 bg-gradient-to-br from-white to-slate-50/80 border border-slate-200 rounded-2xl flex-1 flex flex-col justify-center text-center relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.02)] min-h-[380px]">
      {/* Visual alignment left indicator */}
      <div className={`absolute left-0 top-0 bottom-0 w-2 
        ${result === 'Normal' ? 'bg-emerald-500' :
          result === 'Pra Hipertensi' ? 'bg-amber-400' :
          result === 'Tingkat 1' ? 'bg-orange-500' : 'bg-red-650'}`} 
      />

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
        {result === 'Normal' ? 'Normal' : result === 'Pra Hipertensi' ? 'Pra Hip' : result}
      </motion.h2>
      <p className="text-xs text-slate-400 font-medium mt-1">Berdasarkan model {activeModel}</p>

      {/* High fidelity inline SVG Circular score graph */}
      <ConfidenceGauge confidence={confidence} result={result} />

      {/* 4-bar Stage Indicator */}
      <StageIndicator result={result} />
    </div>
  );
}
