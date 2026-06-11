import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePatientStore } from '../../../stores/patientStore';
import { GlowCard } from '../../../components/ui/spotlight-card';

export default function AgeDistributionChart() {
  const patients = usePatientStore((state) => state.patients);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  const ageData = useMemo(() => {
    const total = patients.length;
    const groups = [
      { label: '< 35', min: 0, max: 34, color: '#3b82f6', bgGradient: 'from-blue-500 to-blue-600' },
      { label: '35 - 44', min: 35, max: 44, color: '#6366f1', bgGradient: 'from-indigo-500 to-indigo-600' },
      { label: '45 - 54', min: 45, max: 54, color: '#8b5cf6', bgGradient: 'from-violet-500 to-violet-600' },
      { label: '55 - 64', min: 55, max: 64, color: '#ec4899', bgGradient: 'from-pink-500 to-pink-600' },
      { label: '>= 65', min: 65, max: 150, color: '#f43f5e', bgGradient: 'from-rose-500 to-rose-600' },
    ];

    if (total === 0) {
      return groups.map((g) => ({ ...g, count: 0, percentage: 0 }));
    }

    return groups.map((g) => {
      const count = patients.filter((p) => p.age >= g.min && p.age <= g.max).length;
      const percentage = Math.round((count / total) * 100);
      return { ...g, count, percentage };
    });
  }, [patients]);

  const maxCount = useMemo(() => {
    return Math.max(...ageData.map((d) => d.count), 1);
  }, [ageData]);

  // Chart layout dimensions
  const chartHeight = 180;
  const barMaxHeight = 130;
  const paddingBottom = 30;

  const hasData = patients.length > 0;

  return (
    <GlowCard 
      className="p-6 relative text-left h-full flex flex-col justify-between"
      glowColor="purple"
      customSize={true}
      overflowVisible={true}
    >
      <div className="flex-shrink-0">
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-1">Distribusi Kelompok Usia</h4>
        <p className="text-xs text-slate-400 font-medium mb-6">Sebaran rekam data pasien berdasarkan kelompok umur</p>
      </div>

      {!hasData ? (
        <div className="h-48 flex items-center justify-center flex-grow">
          <p className="text-sm text-slate-400 font-medium">Belum ada data pasien.</p>
        </div>
      ) : (
        <div className="relative h-48 w-full flex items-end justify-between px-2 sm:px-6 select-none flex-grow pb-2">
          {/* Grid lines background */}
          <div className="absolute inset-x-0 top-0 bottom-[30px] flex flex-col justify-between pointer-events-none opacity-50 z-0">
            <div className="border-b border-slate-100 w-full h-0" />
            <div className="border-b border-slate-100 w-full h-0" />
            <div className="border-b border-slate-100 w-full h-0" />
            <div className="border-b border-slate-100 w-full h-0" />
          </div>

          {/* Bar Chart mapping */}
          {ageData.map((item, idx) => {
            const barHeight = (item.count / maxCount) * barMaxHeight;
            const isHovered = hoveredBarIndex === idx;

            return (
              <div 
                key={item.label}
                className="flex flex-col items-center flex-1 relative group z-10 cursor-pointer"
                onMouseEnter={() => setHoveredBarIndex(idx)}
                onMouseLeave={() => setHoveredBarIndex(null)}
              >
                {/* Visual Bar element with motion.div for animation */}
                <div 
                  className="w-8 sm:w-12 rounded-t-lg relative transition-all duration-300"
                  style={{ height: `${Math.max(barHeight, 6)}px` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-t ${item.bgGradient} rounded-t-lg shadow-sm group-hover:brightness-105 transition-all`} />
                  
                  {isHovered && (
                    <motion.div 
                      layoutId="barGlow"
                      className="absolute -inset-1 rounded-t-xl opacity-30 blur-sm -z-10"
                      style={{ backgroundColor: item.color }}
                    />
                  )}
                </div>

                {/* X Axis Label */}
                <span className="text-[10px] font-bold text-slate-400 mt-2.5 uppercase tracking-wide">
                  {item.label}
                </span>
              </div>
            );
          })}

          {/* Floating dynamic interactive tooltip */}
          <AnimatePresence>
            {hoveredBarIndex !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute p-3 bg-slate-900 border border-slate-800 text-white rounded-xl text-[11px] font-semibold shadow-xl z-20 flex flex-col gap-1 text-left select-none pointer-events-none"
                style={{
                  left: `${((hoveredBarIndex * 2 + 1) / (ageData.length * 2)) * 100}%`,
                  transform: 'translateX(-50%)',
                  bottom: '68px',
                }}
              >
                <span className="font-bold border-b border-slate-800 pb-1.5 text-slate-400 flex items-center justify-between gap-6">
                  <span>Usia {ageData[hoveredBarIndex].label}</span>
                  <span className="text-[9px] bg-slate-800 text-slate-350 px-1.5 py-0.5 rounded font-black uppercase">Demografi</span>
                </span>
                <p className="text-white mt-1.5 flex items-center justify-between gap-4">
                  <span>Jumlah Pasien:</span>
                  <span className="text-purple-400 font-extrabold">{ageData[hoveredBarIndex].count} orang</span>
                </p>
                <p className="text-slate-300 flex items-center justify-between gap-4">
                  <span>Persentase:</span>
                  <span className="text-white font-extrabold">{ageData[hoveredBarIndex].percentage}%</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </GlowCard>
  );
}
