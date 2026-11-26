import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Compass, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="p-4 bg-brand-500/10 text-brand-400 rounded-3xl border border-brand-500/20 mb-6">
        <Compass className="w-16 h-16 animate-pulse" />
      </div>
      <h1 className="text-6xl font-extrabold text-slate-100 tracking-tight">404</h1>
      <h2 className="text-xl font-bold text-slate-200 mt-2">Page Not Found</h2>
      <p className="text-sm text-slate-400 max-w-sm mt-1 mb-8 leading-relaxed">
        The route or resource you are looking for does not exist or may have been relocated.
      </p>
      <Link to="/">
        <Button variant="primary" icon={Home} size="lg">
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};
