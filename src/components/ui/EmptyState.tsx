import React from 'react';
import { cn } from '@/lib/utils/cn';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div className={cn('bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm', className)} {...props}>
      <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
        <Icon className="w-8 h-8" />
      </div>
      <div className="space-y-1 max-w-md mx-auto">
        <p className="text-lg font-bold text-slate-800">{title}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-sky-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-sky-500 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}