import React from 'react';
import { cn } from '../../utils/classnames';
import { getStatusBadgeVariant, formatStatusLabel } from '../../utils/formatters';

export const Badge = ({ children, variant, status, size = 'md', className }) => {
  const resolvedVariant = variant || (status ? getStatusBadgeVariant(status) : 'default');
  const label = children || (status ? formatStatusLabel(status) : '');

  const variants = {
    info: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    secondary: 'bg-slate-800 text-slate-300 border-slate-700',
    default: 'bg-brand-500/10 text-brand-300 border-brand-500/20',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-md border',
    md: 'px-2.5 py-1 text-xs font-semibold rounded-lg border',
    lg: 'px-3 py-1.5 text-sm font-semibold rounded-xl border',
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5 transition-colors', variants[resolvedVariant], sizes[size], className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      {label}
    </span>
  );
};
