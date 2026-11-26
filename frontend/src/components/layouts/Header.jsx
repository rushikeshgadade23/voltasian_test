import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, Shield, Search } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Link } from 'react-router-dom';

export const Header = ({ onToggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
          <Search className="w-3.5 h-3.5" />
          <span>Press <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 rounded border border-slate-700">⌘K</kbd> to quick search</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* System Role Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>Role: {user?.role || 'Guest'}</span>
        </div>

        {/* Notifications Icon */}
        <button className="relative p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-slate-950" />
        </button>

        {/* User Profile Avatar Link */}
        <Link to="/profile" className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <Avatar src={user?.avatar} name={user?.name || 'User'} size="sm" />
          <span className="hidden md:inline text-xs font-medium text-slate-200">{user?.name}</span>
        </Link>
      </div>
    </header>
  );
};
