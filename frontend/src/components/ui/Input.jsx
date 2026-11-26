import React from 'react';
import { cn } from '../../utils/classnames';

export const Input = React.forwardRef(
  ({ className, label, error, helperText, icon: Icon, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            {label}
          </label>
        )}
        <div className="relative rounded-xl shadow-sm">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              'w-full bg-slate-900/80 border text-slate-100 placeholder-slate-500 text-sm rounded-xl py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500',
              Icon ? 'pl-10 pr-4' : 'px-4',
              error
                ? 'border-rose-500 focus:ring-rose-500/40 focus:border-rose-500'
                : 'border-slate-800 hover:border-slate-700',
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-xs text-rose-400 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
