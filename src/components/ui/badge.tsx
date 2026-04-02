import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'critical' | 'high' | 'medium' | 'success' | 'info' | 'outline';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        {
          'border-transparent bg-gray-100 text-gray-800':
            variant === 'default',
          'border-transparent bg-status-critical text-white':
            variant === 'critical',
          'border-transparent bg-status-high text-white':
            variant === 'high',
          'border-transparent bg-status-medium text-white':
            variant === 'medium',
          'border-transparent bg-status-successBg text-status-success':
            variant === 'success',
          'border-transparent bg-status-infoBg text-status-info':
            variant === 'info',
          'text-foreground': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
