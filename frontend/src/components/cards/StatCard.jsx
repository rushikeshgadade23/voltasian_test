import React from 'react';
import { cn } from '../../utils/classnames';

export const StatCard = ({ title, value, change, trend = 'up', icon: Icon, color = 'brand', subtext }) => {
  const colors = {
    brand: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    sky: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  };

  return (
    <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-slate-100 mt-1">{value}</h3>
        </div>
        {Icon && (
          <div className={cn('p-3.5 rounded-2xl border flex items-center justify-center', colors[color])}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(change || subtext) && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          {change && (
            <span
              className={cn(
                'font-semibold px-2 py-0.5 rounded-md',
                trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
              )}
            >
              {trend === 'up' ? '↑' : '↓'} {change}
            </span>
          )}
          {subtext && <span className="text-slate-400">{subtext}</span>}
        </div>
      )}
    </div>
  );
};
