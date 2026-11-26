import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Ticket,
  Users,
  Wrench,
  Compass,
  FileText,
  CreditCard,
  UserCheck,
  User,
  LogOut,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../utils/classnames';
import { Badge } from '../common/Badge';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['admin', 'manager', 'technician', 'customer'] },
    { label: 'Service Tickets', path: '/tickets', icon: Ticket, roles: ['admin', 'manager', 'technician', 'customer'] },
    { label: 'Installations', path: '/installations', icon: Compass, roles: ['admin', 'manager', 'technician'] },
    { label: 'Customers', path: '/customers', icon: Users, roles: ['admin', 'manager'] },
    { label: 'Field Technicians', path: '/technicians', icon: Wrench, roles: ['admin', 'manager'] },
    { label: 'Invoices', path: '/invoices', icon: FileText, roles: ['admin', 'manager', 'customer'] },
    { label: 'Payments', path: '/payments', icon: CreditCard, roles: ['admin', 'manager', 'customer'] },
    { label: 'User Admin', path: '/users', icon: UserCheck, roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !user || item.roles.includes(user.role)
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 bottom-0 z-40 w-64 bg-slate-950/90 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-600/30">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-white font-sans">VOLTASION</h1>
              <p className="text-[10px] uppercase font-semibold text-brand-400 tracking-wider">Service Portal</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                end={item.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer',
                    isActive
                      ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30 font-semibold shadow-inner'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-current transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            ))}
          </nav>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
            <NavLink
              to="/profile"
              onClick={onClose}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/60 transition-colors group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-brand-600/30 text-brand-300 border border-brand-500/40 flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name[0] : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-brand-300">{user?.name || 'User'}</p>
                <div className="mt-0.5">
                  <Badge status={user?.role} size="sm" />
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};
