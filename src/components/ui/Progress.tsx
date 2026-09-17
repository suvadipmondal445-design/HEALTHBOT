import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
}

export function Progress({ value = 0, max = 100, size = 'md', showLabel = false, label, className, ...props }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('w-full', className)} {...props}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-600">{label || 'Progress'}</span>
          <span className="text-xs font-semibold text-slate-900">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-slate-200 rounded-full overflow-hidden', sizeStyles[size])}>
        <div
          className="h-full bg-sky-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function Spinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <Loader2 className={cn('animate-spin text-sky-600', sizeStyles[size], className)} />
  );
}

export function LoadingState({ message = 'Loading...', className }: { message?: string; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 space-y-4', className)}>
      <Spinner size="lg" />
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
}