import React from 'react';
import { HypertensionLevel } from '../../../utils/hypertension';

interface StageIndicatorProps {
  result: HypertensionLevel;
}

export default function StageIndicator({ result }: StageIndicatorProps) {
  return (
    <div className="w-full">
      {/* Stages Bar represent index mapping */}
      <div className="grid grid-cols-4 gap-1.5 mt-auto max-w-[280px] mx-auto w-full pt-4">
        <div className={`h-2 rounded-full transition-all duration-300 ${result === 'Normal' ? 'bg-emerald-500 shadow-sm shadow-emerald-200' : 'bg-emerald-100 opacity-40'}`} />
        <div className={`h-2 rounded-full transition-all duration-300 ${result === 'Pra Hipertensi' ? 'bg-amber-400 shadow-sm shadow-amber-200' : 'bg-amber-100 opacity-40'}`} />
        <div className={`h-2 rounded-full transition-all duration-300 ${result === 'Tingkat 1' ? 'bg-orange-500 shadow-sm shadow-orange-200' : 'bg-orange-100 opacity-40'}`} />
        <div className={`h-2 rounded-full transition-all duration-300 ${result === 'Tingkat 2' ? 'bg-red-600 shadow-sm shadow-red-200' : 'bg-red-100 opacity-40'}`} />
      </div>
      
      <div className="grid grid-cols-4 gap-1.5 max-w-[280px] mx-auto w-full mt-1.5 text-[9px] font-extrabold text-slate-900 dark:text-slate-100 uppercase select-none">
        <span className={result === 'Normal' ? 'text-emerald-700 dark:text-emerald-400 font-black scale-105' : 'text-slate-500 dark:text-slate-400 font-semibold'}>Normal</span>
        <span className={result === 'Pra Hipertensi' ? 'text-amber-700 dark:text-amber-450 font-black scale-105' : 'text-slate-500 dark:text-slate-400 font-semibold'}>Pra</span>
        <span className={result === 'Tingkat 1' ? 'text-orange-700 dark:text-orange-450 font-black scale-105' : 'text-slate-500 dark:text-slate-400 font-semibold'}>Tingkat 1</span>
        <span className={result === 'Tingkat 2' ? 'text-red-700 dark:text-red-450 font-black scale-105' : 'text-slate-500 dark:text-slate-400 font-semibold'}>Tingkat 2</span>
      </div>
    </div>
  );
}
