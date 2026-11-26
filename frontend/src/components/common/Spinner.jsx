import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/classnames';

export const Spinner = ({ size = 'md', className, label }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-4 gap-3', className)}>
      <Loader2 className={cn('animate-spin text-brand-500', sizes[size])} />
      {label && <p className="text-sm font-medium text-slate-400 animate-pulse">{label}</p>}
    </div>
  );
};
