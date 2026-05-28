import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]',
          // Variant styles
          {
            // Primary (Violet/Indigo gradients)
            'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md shadow-violet-200/50 hover:shadow-lg hover:shadow-violet-200/60 focus:ring-violet-500 border-none':
              variant === 'primary',
            // Secondary (Slate bg with hover)
            'bg-slate-100 hover:bg-slate-200 text-slate-700 focus:ring-slate-400':
              variant === 'secondary',
            // Outline (Thin border with clean look)
            'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 focus:ring-slate-400 hover:border-slate-300':
              variant === 'outline',
            // Danger (Red gradient)
            'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-md shadow-rose-200/50 hover:shadow-lg focus:ring-rose-500':
              variant === 'danger',
            // Ghost (Minimalist, padding only)
            'hover:bg-slate-50 text-slate-600 focus:ring-slate-400': variant === 'ghost',
          },
          // Size styles
          {
            'px-3.5 py-1.5 text-xs font-semibold': size === 'sm',
            'px-5 py-2.5 text-sm font-semibold': size === 'md',
            'px-7 py-3 text-base font-semibold': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
