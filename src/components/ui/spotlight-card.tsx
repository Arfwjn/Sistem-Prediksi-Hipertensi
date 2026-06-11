import React, { useEffect, useRef, ReactNode } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
  height?: string | number;
  customSize?: boolean;
  overflowVisible?: boolean;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  glowColor = 'blue',
  size = 'md',
  width,
  height,
  customSize = false,
  overflowVisible = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      container.style.setProperty('--mouse-x', `${x}px`);
      container.style.setProperty('--mouse-y', `${y}px`);
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const colorMap = {
    blue: 'rgba(59, 130, 246, 0.15)',
    purple: 'rgba(147, 51, 234, 0.15)',
    green: 'rgba(34, 197, 94, 0.15)',
    red: 'rgba(239, 68, 68, 0.15)',
    orange: 'rgba(249, 115, 22, 0.15)',
  };

  const borderMap = {
    blue: 'group-hover:border-blue-500/30',
    purple: 'group-hover:border-purple-500/30',
    green: 'group-hover:border-green-500/30',
    red: 'group-hover:border-red-500/30',
    orange: 'group-hover:border-orange-500/30',
  };

  const sizeMap = {
    sm: 'w-48 h-64',
    md: 'w-64 h-80',
    lg: 'w-80 h-96',
  };

  // Determine sizing class
  const sizeClass = customSize ? '' : sizeMap[size];

  // Inline styles for width/height
  const inlineStyles: React.CSSProperties = {};
  if (width !== undefined) {
    inlineStyles.width = typeof width === 'number' ? `${width}px` : width;
  }
  if (height !== undefined) {
    inlineStyles.height = typeof height === 'number' ? `${height}px` : height;
  }

  return (
    <div
      ref={containerRef}
      style={inlineStyles}
      className={`group relative ${overflowVisible ? '' : 'overflow-hidden'} rounded-3xl border border-slate-200 bg-white shadow-[0_6px_35px_rgba(0,0,0,0.04)] p-6 transition-all duration-300 ${borderMap[glowColor]} ${sizeClass} ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${colorMap[glowColor]}, transparent 40%)`,
        }}
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

export type { GlowCardProps };
