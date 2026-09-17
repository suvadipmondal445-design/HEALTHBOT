import React from 'react';
import { cn } from '@/lib/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'sky';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export function Badge({ variant = 'default', size = 'md', className, children, ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-800 border-slate-300',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    warning: 'bg-amber-100 text-amber-800 border-amber-300',
    danger: 'bg-red-100 text-red-800 border-red-300',
    info: 'bg-sky-100 text-sky-800 border-sky-300',
    sky: 'bg-sky-100 text-sky-800 border-sky-300',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-semibold rounded-full',
    md: 'px-2.5 py-1 text-xs font-semibold rounded-full',
  };

  return (
    <span
      className={cn('inline-flex items-center border', variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}