import React from 'react';
import { motion } from 'motion/react';
import { Route } from 'lucide-react';
import { AIModelConfig } from '../../../types';

interface ModelSelectorProps {
  activeModel: AIModelConfig['activeModel'];
  onModelSelect: (model: AIModelConfig['activeModel']) => void;
}

export default function ModelSelector({ activeModel, onModelSelect }: ModelSelectorProps) {
  return (
    <div className="p-5 bg-white border border-slate-100 rounded-2xl flex-shrink-0 text-left select-none relative overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_40px_-5px_rgba(30,41,59,0.04)]">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 tracking-tight uppercase">
          <Route className="text-blue-600 w-4 h-4" />
          <span>Model Evaluation Pipeline (Interactive)</span>
        </h4>
        <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded-full border border-blue-100">
          Ubah Model Aktif
        </span>
      </div>

      {/* A visual timeline path */}
      <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3 py-2">
        {/* SVG connecting track behind */}
        <div className="absolute left-[15%] right-[15%] top-1/2 -translate-y-1/2 h-0.5 border-t border-dashed border-slate-200 hidden sm:block z-0" />
        
        {/* Decision Tree path step */}
        <motion.button
          whileHover={{ y: -1, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="button"
          onClick={() => onModelSelect('Decision Tree')}
          className={`relative flex-1 w-full p-3 rounded-xl border text-left transition-all z-10 flex items-center gap-2.5 cursor-pointer
            ${activeModel === 'Decision Tree' 
              ? 'bg-blue-600 border-blue-600 text-white shadow-[0_4px_16px_rgba(37,99,235,0.2)]' 
              : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200/80 text-slate-700'
            }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs select-none shadow-sm transition-colors
            ${activeModel === 'Decision Tree' 
              ? 'bg-white/10 text-white' 
              : 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
            }`}
          >
            DT
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold truncate">Decision Tree</p>
            <p className={`text-[9px] truncate ${activeModel === 'Decision Tree' ? 'text-blue-100/90 font-semibold' : 'text-slate-400 font-semibold'}`}>
              Cepat &amp; Logis
            </p>
          </div>
          {activeModel === 'Decision Tree' && (
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          )}
        </motion.button>

        {/* Random Forest path step (Most accurate) */}
        <motion.button
          whileHover={{ y: -1, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="button"
          onClick={() => onModelSelect('Random Forest')}
          className={`relative flex-1 w-full p-3 rounded-xl border text-left transition-all z-10 flex items-center gap-2.5 cursor-pointer
            ${activeModel === 'Random Forest' 
              ? 'bg-blue-600 border-blue-600 text-white shadow-[0_4px_16px_rgba(37,99,235,0.2)]' 
              : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200/80 text-slate-700'
            }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs select-none shadow-sm transition-colors
            ${activeModel === 'Random Forest' 
              ? 'bg-white/10 text-white' 
              : 'bg-blue-500/10 text-blue-700 border border-blue-500/20'
            }`}
          >
            RF
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold truncate">Random Forest</p>
            <p className={`text-[9px] truncate ${activeModel === 'Random Forest' ? 'text-blue-100/90 font-semibold' : 'text-slate-400 font-semibold'}`}>
              Ensemble Akurat
            </p>
          </div>
          {activeModel === 'Random Forest' && (
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          )}
        </motion.button>

        {/* Logistic Regression path step */}
        <motion.button
          whileHover={{ y: -1, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="button"
          onClick={() => onModelSelect('Logistic Regression')}
          className={`relative flex-1 w-full p-3 rounded-xl border text-left transition-all z-10 flex items-center gap-2.5 cursor-pointer
            ${activeModel === 'Logistic Regression' 
              ? 'bg-blue-600 border-blue-600 text-white shadow-[0_4px_16px_rgba(37,99,235,0.2)]' 
              : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200/80 text-slate-700'
            }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs select-none shadow-sm transition-colors
            ${activeModel === 'Logistic Regression' 
              ? 'bg-white/10 text-white' 
              : 'bg-indigo-500/10 text-indigo-700 border border-indigo-500/20'
            }`}
          >
            LR
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold truncate">Logistic Reg.</p>
            <p className={`text-[9px] truncate ${activeModel === 'Logistic Regression' ? 'text-blue-100/90 font-semibold' : 'text-slate-400 font-semibold'}`}>
              Statistik Linear
            </p>
          </div>
          {activeModel === 'Logistic Regression' && (
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
