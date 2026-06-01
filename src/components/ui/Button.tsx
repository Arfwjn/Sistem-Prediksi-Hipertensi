import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const isInteractive = !disabled && !isLoading;

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base: clean, modern button with smooth transitions
          'group relative inline-flex items-center justify-center font-medium select-none outline-none cursor-pointer shrink-0',
          'transition-all duration-200 ease-out',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          // Minimalist hover: subtle lift + shadow
          isInteractive && 'hover:-translate-y-[1px] hover:shadow-md active:translate-y-0 active:shadow-sm active:scale-[0.98]',
          // Size Mappings
          {
            'h-9 px-4 text-xs gap-1.5 rounded-lg': size === 'sm',
            'h-11 px-5 text-sm gap-2 rounded-xl': size === 'md',
            'h-14 px-6 text-base gap-2 rounded-2xl': size === 'lg',
          },
          // Variant styles — solid backgrounds with subtle hover brightness shifts
          {
            // Primary: gradient blue with lighter hover
            'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-blue-600/20 shadow-sm shadow-blue-600/10 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/20 hover:text-white':
              variant === 'primary',
            // Secondary: neutral with darkening hover
            'bg-slate-100 text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-200/80 hover:text-slate-800 hover:border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700':
              variant === 'secondary',
            // Outline: transparent with fill-in hover
            'bg-white text-slate-600 border border-slate-300 shadow-sm hover:bg-slate-50 hover:text-slate-800 hover:border-slate-400 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200':
              variant === 'outline',
            // Danger: red gradient with lighter hover
            'bg-gradient-to-r from-rose-500 to-red-600 text-white border border-rose-500/20 shadow-sm shadow-rose-500/10 hover:from-rose-400 hover:to-red-500 hover:shadow-rose-400/20 hover:text-white':
              variant === 'danger',
            // Ghost: invisible with subtle bg hover
            'bg-transparent text-slate-600 border border-transparent hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white':
              variant === 'ghost',
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
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
