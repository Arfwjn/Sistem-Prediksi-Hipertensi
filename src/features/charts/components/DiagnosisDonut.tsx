import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePatientStore } from '../../../stores/patientStore';
import { GlowCard } from '../../../components/ui/spotlight-card';

const DONUT_RADIUS = 35;
const CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS; // ≈ 219.91

const STATUS_CONFIG = [
  { label: 'Normal', color: '#10b981', svgColor: '#10b981' },
  { label: 'Pra Hipertensi', color: '#f59e0b', svgColor: '#f59e0b' },
  { label: 'Tingkat 1', color: '#bc4800', svgColor: '#e11d48' },
  { label: 'Tingkat 2', color: '#ba1a1a', svgColor: '#be123c' },
  { label: 'Krisis Hipertensi', color: '#7f1d1d', svgColor: '#991b1b' },
] as const;

export default function DiagnosisDonut() {
  const [hoveredDoughnutIndex, setHoveredDoughnutIndex] = useState<number | null>(null);
  const patients = usePatientStore((state) => state.patients);

  const doughnutData = useMemo(() => {
    const total = patients.length;
    if (total === 0) {
      return STATUS_CONFIG.map((cfg) => ({ ...cfg, value: 0, count: 0 }));
    }

    return STATUS_CONFIG.map((cfg) => {
      const count = patients.filter((p) => p.status === cfg.label).length;
      const value = Math.round((count / total) * 1000) / 10; // one decimal
      return { ...cfg, value, count };
    });
  }, [patients]);

  // Compute SVG dash segments
  const segments = useMemo(() => {
    let cumulativeOffset = 0;
    return doughnutData.map((item) => {
      const dash = (item.value / 100) * CIRCUMFERENCE;
      const offset = -cumulativeOffset;
      cumulativeOffset += dash;
      return { dash, offset };
    });
  }, [doughnutData]);

  const hasData = patients.length > 0;

  return (
    <GlowCard 
      className="p-6 relative text-left"
      glowColor="green"
      customSize={true}
    >
      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-1">Distribusi Diagnosis</h4>
      <p className="text-xs text-slate-400 font-medium mb-6">Persentase profil diagnosis rekam klinis sistem</p>

      {!hasData ? (
        <div className="flex items-center justify-center h-64 sm:h-56">
          <p className="text-sm text-slate-400 font-medium">Belum ada data pasien.</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 h-64 sm:h-56">
          {/* Custom donut chart */}
          <div className="relative w-40 h-40 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90 scale-x-[-1]" viewBox="0 0 100 100">
              {doughnutData.map((item, idx) => {
                if (item.value === 0) return null;
                return (
                  <circle
                    key={item.label}
                    cx="50"
                    cy="50"
                    r={DONUT_RADIUS}
                    fill="transparent"
                    stroke={item.svgColor}
                    strokeWidth={hoveredDoughnutIndex === idx ? '13.5' : '11'}
                    strokeDasharray={`${segments[idx].dash} ${CIRCUMFERENCE}`}
                    strokeDashoffset={segments[idx].offset}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredDoughnutIndex(idx)}
                    onMouseLeave={() => setHoveredDoughnutIndex(null)}
                  />
                );
              })}
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
                    <span className="text-2xl font-black text-slate-800 tracking-tight block leading-none">{patients.length}</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Pasien</span>
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
                      style={{ color: doughnutData[hoveredDoughnutIndex].svgColor }}
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
                    style={{ backgroundColor: item.svgColor }} 
                  />
                  <span className="text-xs font-bold text-slate-600">{item.label}</span>
                </div>
                <span className="text-[11px] font-extrabold text-slate-700 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </GlowCard>
  );
}
