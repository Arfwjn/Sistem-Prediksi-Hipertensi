import React, { HTMLAttributes } from 'react';
import { HYPERTENSION_COLORS, HypertensionLevel } from '../../constants/colors';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: HypertensionLevel | 'default' | 'neutral' | 'success' | 'warning' | 'danger';
  children?: React.ReactNode;
  className?: string;
}

export const Badge = ({ className, variant = 'default', children, ...props }: BadgeProps) => {
  // If it matches a clinical status level, use the mapped theme
  if (variant in HYPERTENSION_COLORS) {
    const theme = HYPERTENSION_COLORS[variant as HypertensionLevel];
    return (
      <span
        className={cn(
          'inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg border leading-none',
          theme.bg,
          className
        )}
        {...props}
      >
        {children || variant}
      </span>
    );
  }

  // Fallbacks for standard generic types
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg leading-none border',
        {
          'bg-slate-50 text-slate-700 border-slate-200': variant === 'default' || variant === 'neutral',
          'bg-emerald-50 text-emerald-700 border-emerald-200': variant === 'success',
          'bg-amber-50 text-amber-700 border-amber-200': variant === 'warning',
          'bg-rose-50 text-rose-700 border-rose-200': variant === 'danger',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
