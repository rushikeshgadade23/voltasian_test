import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, Home } from 'lucide-react';

export const UnauthorizedPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="p-4 bg-rose-500/10 text-rose-400 rounded-3xl border border-rose-500/20 mb-6">
        <ShieldAlert className="w-16 h-16" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight">403 — Unauthorized</h1>
      <p className="text-sm text-slate-400 max-w-sm mt-2 mb-8 leading-relaxed">
        You do not have administrative permission to access this module or view these records.
      </p>
      <Link to="/">
        <Button variant="primary" icon={Home} size="lg">
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};
