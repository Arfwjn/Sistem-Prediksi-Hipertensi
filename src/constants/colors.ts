export const HYPERTENSION_COLORS = {
  Normal: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    text: 'text-emerald-700',
    primary: '#10b981', // emerald-500
    primaryLight: 'rgba(16, 185, 129, 0.1)',
  },
  'Pra Hipertensi': {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    text: 'text-amber-700',
    primary: '#f59e0b', // amber-500
    primaryLight: 'rgba(245, 158, 11, 0.1)',
  },
  'Tingkat 1': {
    bg: 'bg-orange-50 text-orange-700 border-orange-200',
    text: 'text-orange-700',
    primary: '#f97316', // orange-500
    primaryLight: 'rgba(249, 115, 22, 0.1)',
  },
  'Tingkat 2': {
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    text: 'text-rose-700',
    primary: '#ef4444', // rose-500 or red-500
    primaryLight: 'rgba(239, 68, 68, 0.1)',
  },
  'Krisis Hipertensi': {
    bg: 'bg-red-100 text-red-800 border-red-300 animate-pulse',
    text: 'text-red-800 font-bold',
    primary: '#b91c1c', // red-700
    primaryLight: 'rgba(185, 28, 28, 0.2)',
  },
} as const;

export type HypertensionLevel = keyof typeof HYPERTENSION_COLORS;
