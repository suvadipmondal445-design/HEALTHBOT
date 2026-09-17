import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary: 'bg-sky-600 hover:bg-sky-500 text-white shadow-sm',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700',
    outline: 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-300',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700',
    danger: 'bg-red-600 hover:bg-red-500 text-white shadow-sm',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg',
    md: 'px-4 py-2.5 text-sm font-bold rounded-xl',
    lg: 'px-6 py-3.5 text-base font-bold rounded-xl',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}