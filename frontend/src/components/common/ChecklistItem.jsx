import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/classnames';

export const ChecklistItem = ({ label, isCompleted, onToggle, disabled = false }) => {
  return (
    <div
      onClick={() => !disabled && onToggle && onToggle(!isCompleted)}
      className={cn(
        'flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none',
        isCompleted
          ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-100'
          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300',
        disabled && 'opacity-60 cursor-not-allowed'
      )}
    >
      <div
        className={cn(
          'w-5 h-5 rounded-md flex items-center justify-center border transition-colors',
          isCompleted
            ? 'bg-emerald-500 border-emerald-500 text-slate-950'
            : 'border-slate-600 bg-slate-800'
        )}
      >
        {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>
      <span className={cn('text-sm font-medium flex-1', isCompleted && 'line-through text-slate-400')}>
        {label}
      </span>
    </div>
  );
};
