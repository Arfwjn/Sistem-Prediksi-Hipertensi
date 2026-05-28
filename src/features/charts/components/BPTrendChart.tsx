import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function BPTrendChart() {
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'];
  const systolicTrend = [120, 125, 122, 130, 135, 140, 142];
  const diastolicTrend = [80, 82, 80, 85, 88, 90, 92];

  const sysPoints = [
    { x: 60, y: 160, val: 120, month: 'Jan' },
    { x: 160, y: 140, val: 125, month: 'Feb' },
    { x: 260, y: 152, val: 122, month: 'Mar' },
    { x: 360, y: 120, val: 130, month: 'Apr' },
    { x: 460, y: 100, val: 135, month: 'Mei' },
    { x: 560, y: 80, val: 140, month: 'Jun' },
    { x: 660, y: 72, val: 142, month: 'Jul' }
  ];

  const diaPoints = [
    { x: 60, y: 190, val: 80, month: 'Jan' },
    { x: 160, y: 184, val: 82, month: 'Feb' },
    { x: 260, y: 190, val: 80, month: 'Mar' },
    { x: 360, y: 175, val: 85, month: 'Apr' },
    { x: 460, y: 166, val: 88, month: 'Mei' },
    { x: 560, y: 160, val: 90, month: 'Jun' },
    { x: 660, y: 154, val: 92, month: 'Jul' }
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_40px_-5px_rgba(30,41,59,0.04)] relative text-left">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Tren Tekanan Darah (Klinis)</h4>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Rata-rata profil sistolik vs diastolik bulanan (Jan-Jul)</p>
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

          {/* Grids lines background */}
          <line x1="40" y1="40" x2="680" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="40" y1="90" x2="680" y2="90" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="40" y1="140" x2="680" y2="140" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="40" y1="190" x2="680" y2="190" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />

          {/* Dynamic Area Under Curves Filled Glows */}
          <path
            d="M 60,160 C 110,150 110,140 160,140 C 210,140 210,152 260,152 C 310,152 310,120 360,120 C 410,120 410,100 460,100 C 510,100 510,80 560,80 C 610,80 610,72 660,72 L 660,220 L 60,220 Z"
            fill="url(#sysGlow)"
            className="pointer-events-none transition-all duration-350"
          />
          <path
            d="M 60,190 C 110,187 110,184 160,184 C 210,184 210,190 260,190 C 310,190 310,175 360,175 C 410,175 410,166 460,166 C 510,166 510,160 560,160 C 610,160 610,154 660,154 L 660,220 L 60,220 Z"
            fill="url(#diaGlow)"
            className="pointer-events-none transition-all duration-350"
          />

          {/* Exact Curved Splines representing computed coordinates */}
          <path
            d="M 60,160 C 110,150 110,140 160,140 C 210,140 210,152 260,152 C 310,152 310,120 360,120 C 410,120 410,100 460,100 C 510,100 510,80 560,80 C 610,80 610,72 660,72"
            fill="none"
            stroke="#2563eb"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="pointer-events-none"
          />
          <path
            d="M 60,190 C 110,187 110,184 160,184 C 210,184 210,190 260,190 C 310,190 310,175 360,175 C 410,175 410,166 460,166 C 510,166 510,160 560,160 C 610,160 610,154 660,154"
            fill="none"
            stroke="#6366f1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="5 3"
            className="pointer-events-none"
          />

          {/* Interactive guidelines drawing on active hover column slice */}
          {hoveredTrendIndex !== null && (
            <line
              x1={60 + hoveredTrendIndex * 100}
              y1="25"
              x2={60 + hoveredTrendIndex * 100}
              y2="215"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="pointer-events-none"
            />
          )}

          {/* Coordinate points overlay indexes */}
          {/* SYS coordinates markers with glow animations */}
          {sysPoints.map((pt, idx) => (
            <g key={`sys-pt-${idx}`} className="pointer-events-none">
              {hoveredTrendIndex === idx && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="12"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="1.5"
                  className="animate-ping opacity-35"
                />
              )}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredTrendIndex === idx ? '7.5' : '5'}
                fill="#ffffff"
                stroke="#2563eb"
                strokeWidth={hoveredTrendIndex === idx ? '3.5' : '2.5'}
                className="transition-all duration-150"
              />
            </g>
          ))}

          {/* DIA Coordinates markers with micro glowing rings */}
          {diaPoints.map((pt, idx) => (
            <g key={`dia-pt-${idx}`} className="pointer-events-none">
              {hoveredTrendIndex === idx && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="10"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="1.5"
                  className="animate-ping opacity-30"
                />
              )}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredTrendIndex === idx ? '6.5' : '4.5'}
                fill="#ffffff"
                stroke="#6366f1"
                strokeWidth={hoveredTrendIndex === idx ? '3' : '2'}
                className="transition-all duration-150"
              />
            </g>
          ))}

          {/* Month Titles Label */}
          {months.map((m, idx) => (
            <text
              key={`lbl-month-${idx}`}
              x={60 + idx * 100}
              y="235"
              textAnchor="middle"
              className="text-[10px] font-bold text-slate-400 uppercase select-none"
            >
              {m}
            </text>
          ))}

          {/* Responsive columns vertical slices triggers covers entire chart height */}
          {sysPoints.map((pt, idx) => (
            <rect
              key={`slice-hover-trigger-${idx}`}
              x={10 + idx * 100}
              y="10"
              width="100"
              height="210"
              fill="transparent"
              className="cursor-crosshair select-none"
              onMouseEnter={() => setHoveredTrendIndex(idx)}
              onMouseLeave={() => setHoveredTrendIndex(null)}
            />
          ))}
        </svg>

        {/* Float values popup bubble styled elegantly next to cursor line */}
        <AnimatePresence>
          {hoveredTrendIndex !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="absolute p-3 bg-slate-900 border border-slate-800 text-white rounded-xl text-[11px] font-semibold shadow-xl z-20 flex flex-col gap-1 text-left select-none pointer-events-none"
              style={{
                left: `${60 + hoveredTrendIndex * 100}px`,
                transform: hoveredTrendIndex >= 5 ? 'translateX(-115%)' : 'translateX(12px)',
                top: '25px'
              }}
            >
              <span className="font-bold border-b border-slate-800 pb-1.5 text-slate-400 flex items-center justify-between gap-6">
                <span>{months[hoveredTrendIndex]} (Rata-rata)</span>
                <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded uppercase font-black">Histori</span>
              </span>
              <p className="text-blue-400 mt-1.5 flex items-center justify-between gap-4">
                <span>Sistolik (SYS):</span>
                <span className="text-white font-black">{systolicTrend[hoveredTrendIndex]} <span className="text-[9px] text-white/50 font-normal">mmHg</span></span>
              </p>
              <p className="text-indigo-300 flex items-center justify-between gap-4">
                <span>Diastolik (DIA):</span>
                <span className="text-white font-black">{diastolicTrend[hoveredTrendIndex]} <span className="text-[9px] text-white/50 font-normal">mmHg</span></span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
