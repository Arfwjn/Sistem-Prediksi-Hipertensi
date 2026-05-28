import React, { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glow?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = false, glow = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles (sleek borders, nice bg)
          'bg-white border border-slate-100/80 rounded-2xl p-5 md:p-6 transition-all duration-300 relative overflow-hidden',
          // Shadow effects
          'shadow-sm shadow-slate-100/50',
          {
            // Interactive hover effect
            'hover:shadow-md hover:shadow-slate-100/80 hover:border-slate-200/50 hover:translate-y-[-2px]':
              hoverEffect,
            // Subtle premium glow
            'before:absolute before:top-0 before:left-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-violet-500 before:to-indigo-500':
              glow,
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
