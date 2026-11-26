import React from 'react';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TechnicianCard = ({ technician, onToggleAvailability }) => {
  const name = technician.user?.name || technician.employeeCode;
  const rating = technician.rating?.average || 5.0;

  return (
    <div className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800 flex flex-col justify-between gap-4">
      <div>
        <div className="flex items-start gap-3">
          <Avatar src={technician.user?.avatar} name={name} status={technician.availability} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">{technician.employeeCode}</span>
              <Badge status={technician.availability} size="sm" />
            </div>
            <h4 className="text-base font-semibold text-slate-100 truncate mt-0.5">{name}</h4>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-slate-200">{rating.toFixed(1)}</span>
              <span className="text-slate-500">({technician.rating?.count || 0} reviews)</span>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Skills & Expertise</p>
          <div className="flex flex-wrap gap-1.5">
            {(technician.skills || []).map((skill, idx) => (
              <span key={idx} className="px-2 py-0.5 text-xs bg-slate-800/80 text-brand-300 rounded-lg border border-slate-700">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{technician.activeTicketCount || 0}/{technician.maxConcurrentTickets || 5} active jobs</span>
        </div>
        <Link
          to={`/technicians/${technician._id}`}
          className="inline-flex items-center gap-1 font-medium text-brand-400 hover:text-brand-300 transition-colors"
        >
          View Profile
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
