import React from 'react';
import { cn } from '../../utils/classnames';
import { ChevronDown } from 'lucide-react';

export const Select = React.forwardRef(
  ({ className, label, error, helperText, options = [], children, placeholder = 'Select an option', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            {label}
          </label>
        )}
        <div className="relative rounded-xl shadow-sm">
          <select
            ref={ref}
            className={cn(
              'w-full bg-slate-900/80 border text-slate-100 text-sm rounded-xl py-2.5 pl-4 pr-10 appearance-none transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 cursor-pointer',
              error
                ? 'border-rose-500 focus:ring-rose-500/40 focus:border-rose-500'
                : 'border-slate-800 hover:border-slate-700',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-slate-900 text-slate-500">
                {placeholder}
              </option>
            )}
            {children
              ? children
              : options.map((opt) => (
                  <option
                    key={typeof opt === 'string' ? opt : opt.value}
                    value={typeof opt === 'string' ? opt : opt.value}
                    className="bg-slate-900 text-slate-100"
                  >
                    {typeof opt === 'string' ? opt : opt.label}
                  </option>
                ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
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

Select.displayName = 'Select';
