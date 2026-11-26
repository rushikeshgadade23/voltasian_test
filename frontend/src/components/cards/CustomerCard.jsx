import React from 'react';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomerCard = ({ customer }) => {
  const title = customer.type === 'business' ? customer.companyName : customer.user?.name || customer.customerCode;

  return (
    <div className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800 flex flex-col justify-between gap-4">
      <div>
        <div className="flex items-start gap-3">
          <Avatar name={title} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">{customer.customerCode}</span>
              <Badge variant={customer.type === 'business' ? 'info' : 'secondary'} size="sm">
                {customer.type}
              </Badge>
            </div>
            <h4 className="text-base font-semibold text-slate-100 truncate mt-0.5">{title}</h4>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span className="truncate">{customer.user?.email || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span>{customer.user?.phone || 'N/A'}</span>
          </div>
          {customer.billingAddress?.city && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span className="truncate">{customer.billingAddress.city}, {customer.billingAddress.state}</span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {(customer.tags || []).slice(0, 2).map((tag, i) => (
            <span key={i} className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded-md">
              {tag}
            </span>
          ))}
        </div>
        <Link
          to={`/customers/${customer._id}`}
          className="inline-flex items-center gap-1 font-medium text-brand-400 hover:text-brand-300 transition-colors"
        >
          View Profile
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
