import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function DiagnosisDonut() {
  const [hoveredDoughnutIndex, setHoveredDoughnutIndex] = useState<number | null>(null);

  const doughnutData = [
    { label: 'Normal', value: 45, color: '#10b981' },
    { label: 'Pra Hipertensi', value: 25, color: '#f59e0b' },
    { label: 'Tingkat 1', value: 20, color: '#bc4800' },
    { label: 'Tingkat 2', value: 10, color: '#ba1a1a' }
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_40px_-5px_rgba(30,41,59,0.04)] relative text-left">
      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-1">Distribusi Diagnosis</h4>
      <p className="text-xs text-slate-400 font-medium mb-6">Persentase profil diagnosis rekam klinis sistem</p>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 h-64 sm:h-56">
        {/* Custom static pie donut representation upgraded with active readout */}
        <div className="relative w-40 h-40 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90 scale-x-[-1]" viewBox="0 0 100 100">
            {/* Normal Circle 45% */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="transparent"
              stroke="#10b981"
              strokeWidth={hoveredDoughnutIndex === 0 ? "13.5" : "11"}
              strokeDasharray="98.9 219.9"
              strokeDashoffset="0"
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredDoughnutIndex(0)}
              onMouseLeave={() => setHoveredDoughnutIndex(null)}
            />
            
            {/* Pra Hipertensi segment 25% */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="transparent"
              stroke="#f59e0b"
              strokeWidth={hoveredDoughnutIndex === 1 ? "13.5" : "11"}
              strokeDasharray="54.9 219.9"
              strokeDashoffset="-98.9"
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredDoughnutIndex(1)}
              onMouseLeave={() => setHoveredDoughnutIndex(null)}
            />

            {/* Tingkat 1 segment 20% */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="transparent"
              stroke="#e11d48"
              strokeWidth={hoveredDoughnutIndex === 2 ? "13.5" : "11"}
              strokeDasharray="43.9 219.9"
              strokeDashoffset="-153.9"
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredDoughnutIndex(2)}
              onMouseLeave={() => setHoveredDoughnutIndex(null)}
            />

            {/* Tingkat 2 segment 10% */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="transparent"
              stroke="#be123c"
              strokeWidth={hoveredDoughnutIndex === 3 ? "13.5" : "11"}
              strokeDasharray="21.9 219.9"
              strokeDashoffset="-197.9"
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredDoughnutIndex(3)}
              onMouseLeave={() => setHoveredDoughnutIndex(null)}
            />
          </svg>
          
          {/* Central text overlay with smooth AnimatePresence transition */}
          <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none select-none transition-all duration-200">
            <AnimatePresence mode="wait">
              {hoveredDoughnutIndex === null ? (
                <motion.div
                  key="total"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center"
                >
                  <span className="text-2xl font-black text-slate-800 tracking-tight block leading-none">100%</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Diagnosis</span>
                </motion.div>
              ) : (
                <motion.div
                  key={`doughnut-${hoveredDoughnutIndex}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center px-1 max-w-[84px]"
                >
                  <span 
                    className="text-2xl font-black tracking-tight block leading-none transition-colors"
                    style={{ color: doughnutData[hoveredDoughnutIndex].color === '#bc4800' ? '#e11d48' : doughnutData[hoveredDoughnutIndex].color === '#ba1a1a' ? '#be123c' : doughnutData[hoveredDoughnutIndex].color }}
                  >
                    {doughnutData[hoveredDoughnutIndex].value}%
                  </span>
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-wide block mt-1 leading-snug break-words">
                    {doughnutData[hoveredDoughnutIndex].label}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Custom interactive Legend sidebar panels */}
        <div className="flex-1 space-y-1.5 select-none w-full sm:w-auto text-left pl-0">
          {doughnutData.map((item, idx) => (
            <div 
              key={item.label}
              onMouseEnter={() => setHoveredDoughnutIndex(idx)}
              onMouseLeave={() => setHoveredDoughnutIndex(null)}
              className={`p-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer duration-150
                ${hoveredDoughnutIndex === idx 
                  ? 'bg-slate-50/80 border-slate-200/80 shadow-sm translate-x-1' 
                  : 'bg-white border-transparent'
                }`}
            >
              <div className="flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: item.color === '#bc4800' ? '#e11d48' : item.color === '#ba1a1a' ? '#be123c' : item.color }} 
                />
                <span className="text-xs font-bold text-slate-600">{item.label}</span>
              </div>
              <span className="text-[11px] font-extrabold text-slate-700 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
