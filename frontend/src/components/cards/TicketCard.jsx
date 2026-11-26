import React from 'react';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TicketCard = ({ ticket }) => {
  return (
    <div className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800 flex flex-col justify-between gap-4">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-mono font-semibold text-brand-400">{ticket.ticketNumber}</span>
          <div className="flex gap-1.5">
            <Badge status={ticket.priority} size="sm" />
            <Badge status={ticket.status} size="sm" />
          </div>
        </div>

        <h4 className="text-base font-semibold text-slate-100 line-clamp-1 group-hover:text-brand-400 transition-colors">
          {ticket.title}
        </h4>
        <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
          {ticket.description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{formatDate(ticket.createdAt)}</span>
        </div>

        <Link
          to={`/tickets/${ticket._id}`}
          className="inline-flex items-center gap-1 font-medium text-brand-400 hover:text-brand-300 transition-colors"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
