import React from 'react';
import { cn } from '../../utils/classnames';

export const Textarea = React.forwardRef(
  ({ className, label, error, helperText, rows = 4, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            'w-full bg-slate-900/80 border text-slate-100 placeholder-slate-500 text-sm rounded-xl p-3.5 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 resize-y',
            error
              ? 'border-rose-500 focus:ring-rose-500/40 focus:border-rose-500'
              : 'border-slate-800 hover:border-slate-700',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-rose-400 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
