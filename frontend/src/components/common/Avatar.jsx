import React from 'react';
import { cn } from '../../utils/classnames';
import { getInitials } from '../../utils/formatters';

export const Avatar = ({ src, name, size = 'md', className, status }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg font-bold',
  };

  const statusColors = {
    available: 'bg-emerald-500',
    busy: 'bg-amber-500',
    on_leave: 'bg-rose-500',
    offline: 'bg-slate-500',
  };

  return (
    <div className="relative inline-block flex-shrink-0">
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className={cn('rounded-full object-cover ring-2 ring-slate-800', sizes[size], className)}
        />
      ) : (
        <div
          className={cn(
            'rounded-full bg-gradient-to-br from-brand-600 to-indigo-800 text-white font-semibold flex items-center justify-center ring-2 ring-slate-800 shadow-inner',
            sizes[size],
            className
          )}
        >
          {getInitials(name)}
        </div>
      )}
      {status && statusColors[status] && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-slate-900',
            statusColors[status],
            size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'
          )}
        />
      )}
    </div>
  );
};
