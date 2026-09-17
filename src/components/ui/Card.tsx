import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'bordered' | 'subtle';
}

export function Card({ children, className, variant = 'default', ...props }: CardProps) {
  const variantStyles = {
    default: 'bg-white border border-slate-200 shadow-sm',
    elevated: 'bg-white border border-slate-200 shadow-md',
    bordered: 'bg-white border-2 border-slate-300 shadow-sm',
    subtle: 'bg-slate-50 border border-slate-200',
  };

  return (
    <div
      className={cn('rounded-2xl p-6', variantStyles[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-2 mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('font-bold text-lg text-slate-900', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center gap-3 pt-4 border-t border-slate-100 mt-4', className)} {...props}>
      {children}
    </div>
  );
}