import React, { HTMLAttributes, forwardRef } from 'react';
import { GlowCard } from './spotlight-card';
import { cn } from '../../utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glow?: boolean;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glowColor = 'blue', children, ...props }, ref) => {
    return (
      <GlowCard
        className={cn("", className)}
        glowColor={glowColor}
        customSize={true}
      >
        {children}
      </GlowCard>
    );
  }
);

Card.displayName = 'Card';
