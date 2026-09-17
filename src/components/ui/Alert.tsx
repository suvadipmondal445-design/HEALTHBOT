import React from 'react';
import { cn } from '@/lib/utils/cn';
import { AlertTriangle, ShieldAlert, Info, CheckCircle2, Lock } from 'lucide-react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'warning' | 'danger' | 'success' | 'privacy';
  title?: string;
  children: React.ReactNode;
}

export function Alert({ variant = 'info', title, children, className, ...props }: AlertProps) {
  const variantStyles = {
    info: 'bg-sky-50 border-sky-200 text-sky-900',
    warning: 'bg-amber-50 border-amber-300 text-amber-900',
    danger: 'bg-red-50 border-red-200 text-red-900',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    privacy: 'bg-slate-900 border-slate-800 text-slate-200',
  };

  const icons = {
    info: Info,
    warning: AlertTriangle,
    danger: ShieldAlert,
    success: CheckCircle2,
    privacy: Lock,
  };

  const Icon = icons[variant];

  return (
    <div
      className={cn('rounded-xl border p-4 space-y-2', variantStyles[variant], className)}
      {...props}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', variant === 'privacy' ? 'text-sky-400' : 'text-current')} />
        <div className="flex-1 space-y-1">
          {title && <p className="font-bold text-sm">{title}</p>}
          <div className="text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}