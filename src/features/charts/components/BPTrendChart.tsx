import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePatientStore } from '../../../stores/patientStore';
import { GlowCard } from '../../../components/ui/spotlight-card';

export default function BPTrendChart() {
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);
  const patients = usePatientStore((state) => state.patients);

  // Aggregate BP data: use the first patient with bpHistory, or average across all
  const chartData = useMemo(() => {
    // Find patients with BP history data
    const patientsWithHistory = patients.filter((p) => p.bpHistory && p.bpHistory.length > 0);
    if (patientsWithHistory.length === 0) return null;

    // Use the first patient's BP history as the primary trend line
    const primaryPatient = patientsWithHistory[0];
    const entries = primaryPatient.bpHistory.slice(0, 7); // Max 7 data points

    const months = entries.map((e) => e.date);
    const systolicValues = entries.map((e) => e.systolic);
    const diastolicValues = entries.map((e) => e.diastolic);

    return { months, systolicValues, diastolicValues, patientName: primaryPatient.name };
  }, [patients]);

  // SVG coordinate mapping
  const chartWidth = 700;
  const chartPadding = 60;
  const chartRight = 660;
  const yMin = 40;  // top of chart area
  const yMax = 210; // bottom of chart area
  const bpMin = 60;  // minimum BP value for scale
  const bpMax = 200; // maximum BP value for scale

  const mapBPtoY = (bp: number) => {
    const clamped = Math.max(bpMin, Math.min(bpMax, bp));
    return yMax - ((clamped - bpMin) / (bpMax - bpMin)) * (yMax - yMin);
  };

  const getPoints = (values: number[], count: number) => {
    const spacing = count > 1 ? (chartRight - chartPadding) / (count - 1) : 0;
    return values.map((val, idx) => ({
      x: chartPadding + idx * spacing,
      y: mapBPtoY(val),
      val,
    }));
  };

  // Build dynamic SVG path from points using cubic bezier curves
  const buildCurvePath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return '';
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cpx = (curr.x + next.x) / 2;
      d += ` C ${cpx},${curr.y} ${cpx},${next.y} ${next.x},${next.y}`;
    }
    return d;
  };

  // Build area fill path (closes to bottom of chart)
  const buildAreaPath = (points: { x: number; y: number }[]) => {
    const curvePath = buildCurvePath(points);
    if (!curvePath) return '';
    const lastPt = points[points.length - 1];
    const firstPt = points[0];
    return `${curvePath} L ${lastPt.x},220 L ${firstPt.x},220 Z`;
  };

  if (!chartData) {
    return (
      <GlowCard 
        className="p-6 relative text-left"
        glowColor="blue"
        customSize={true}
      >
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Tren Tekanan Darah (Klinis)</h4>
        <div className="h-64 flex items-center justify-center">
          <p className="text-sm text-slate-400 font-medium">Belum ada data riwayat tekanan darah pasien.</p>
        </div>
      </GlowCard>
    );
  }

  const { months, systolicValues, diastolicValues, patientName } = chartData;
  const sysPoints = getPoints(systolicValues, systolicValues.length);
  const diaPoints = getPoints(diastolicValues, diastolicValues.length);

  return (
    <GlowCard 
      className="p-6 relative text-left"
      glowColor="blue"
      customSize={true}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Tren Tekanan Darah (Klinis)</h4>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Profil sistolik vs diastolik — {patientName}</p>
        </div>
        {/* Legend indicators */}
        <div className="flex gap-4 select-none">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
            SYS (Sistolik)
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
            DIA (Diastolik)
          </span>
        </div>
      </div>

      {/* Render Custom Responsive interactive-friendly SVG Line chart */}
      <div className="h-64 w-full relative">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 700 240">
          <defs>
            <linearGradient id="sysGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="diaGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid lines background */}
          <line x1="40" y1="40" x2="680" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="40" y1="90" x2="680" y2="90" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="40" y1="140" x2="680" y2="140" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="40" y1="190" x2="680" y2="190" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />

          {/* Dynamic Area Under Curves Filled Glows */}
          <path d={buildAreaPath(sysPoints)} fill="url(#sysGlow)" className="pointer-events-none transition-all duration-350" />
          <path d={buildAreaPath(diaPoints)} fill="url(#diaGlow)" className="pointer-events-none transition-all duration-350" />

          {/* Exact Curved Splines */}
          <path d={buildCurvePath(sysPoints)} fill="none" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" className="pointer-events-none" />
          <path d={buildCurvePath(diaPoints)} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 3" className="pointer-events-none" />

          {/* Interactive guideline on hover */}
          {hoveredTrendIndex !== null && (
            <line
              x1={sysPoints[hoveredTrendIndex]?.x ?? 0}
              y1="25"
              x2={sysPoints[hoveredTrendIndex]?.x ?? 0}
              y2="215"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="pointer-events-none"
            />
          )}

          {/* SYS coordinate markers */}
          {sysPoints.map((pt, idx) => (
            <g key={`sys-pt-${idx}`} className="pointer-events-none">
              {hoveredTrendIndex === idx && (
                <circle cx={pt.x} cy={pt.y} r="12" fill="none" stroke="#2563eb" strokeWidth="1.5" className="animate-ping opacity-35" />
              )}
              <circle
                cx={pt.x} cy={pt.y}
                r={hoveredTrendIndex === idx ? '7.5' : '5'}
                fill="#ffffff" stroke="#2563eb"
                strokeWidth={hoveredTrendIndex === idx ? '3.5' : '2.5'}
                className="transition-all duration-150"
              />
            </g>
          ))}

          {/* DIA coordinate markers */}
          {diaPoints.map((pt, idx) => (
            <g key={`dia-pt-${idx}`} className="pointer-events-none">
              {hoveredTrendIndex === idx && (
                <circle cx={pt.x} cy={pt.y} r="10" fill="none" stroke="#6366f1" strokeWidth="1.5" className="animate-ping opacity-30" />
              )}
              <circle
                cx={pt.x} cy={pt.y}
                r={hoveredTrendIndex === idx ? '6.5' : '4.5'}
                fill="#ffffff" stroke="#6366f1"
                strokeWidth={hoveredTrendIndex === idx ? '3' : '2'}
                className="transition-all duration-150"
              />
            </g>
          ))}

          {/* Month labels */}
          {months.map((m, idx) => (
            <text
              key={`lbl-month-${idx}`}
              x={sysPoints[idx]?.x ?? 0}
              y="235"
              textAnchor="middle"
              className="text-[10px] font-bold text-slate-400 uppercase select-none"
            >
              {m}
            </text>
          ))}

          {/* Hover trigger columns */}
          {sysPoints.map((pt, idx) => {
            const spacing = sysPoints.length > 1 ? (chartRight - chartPadding) / (sysPoints.length - 1) : chartWidth;
            return (
              <rect
                key={`slice-hover-trigger-${idx}`}
                x={pt.x - spacing / 2}
                y="10"
                width={spacing}
                height="210"
                fill="transparent"
                className="cursor-crosshair select-none"
                onMouseEnter={() => setHoveredTrendIndex(idx)}
                onMouseLeave={() => setHoveredTrendIndex(null)}
              />
            );
          })}
        </svg>

        {/* Float values popup bubble */}
        <AnimatePresence>
          {hoveredTrendIndex !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="absolute p-3 bg-slate-900 border border-slate-800 text-white rounded-xl text-[11px] font-semibold shadow-xl z-20 flex flex-col gap-1 text-left select-none pointer-events-none"
              style={{
                left: `${sysPoints[hoveredTrendIndex]?.x ?? 0}px`,
                transform: hoveredTrendIndex >= months.length - 2 ? 'translateX(-115%)' : 'translateX(12px)',
                top: '25px'
              }}
            >
              <span className="font-bold border-b border-slate-800 pb-1.5 text-slate-400 flex items-center justify-between gap-6">
                <span>{months[hoveredTrendIndex]}</span>
                <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded uppercase font-black">Histori</span>
              </span>
              <p className="text-blue-400 mt-1.5 flex items-center justify-between gap-4">
                <span>Sistolik (SYS):</span>
                <span className="text-white font-black">{systolicValues[hoveredTrendIndex]} <span className="text-[9px] text-white/50 font-normal">mmHg</span></span>
              </p>
              <p className="text-indigo-300 flex items-center justify-between gap-4">
                <span>Diastolik (DIA):</span>
                <span className="text-white font-black">{diastolicValues[hoveredTrendIndex]} <span className="text-[9px] text-white/50 font-normal">mmHg</span></span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlowCard>
  );
}
