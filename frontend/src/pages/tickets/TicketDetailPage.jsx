import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ticketService } from '../../services/ticket.service';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/common/Spinner';
import { Modal } from '../../components/common/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { formatDate } from '../../utils/formatters';
import {
  Ticket,
  User,
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Edit,
  CheckCircle2,
  AlertTriangle,
  Paperclip,
} from 'lucide-react';
import { TICKET_STATUS } from '../../constants/enums';

export const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchTicketDetail() {
      try {
        const res = await ticketService.getById(id);
        if (res.data?.data) {
          setTicket(res.data.data);
          setNewStatus(res.data.data.status);
        }
      } catch (err) {
        console.error('Failed to load ticket details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTicketDetail();
  }, [id]);

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      await ticketService.updateStatus(id, newStatus, statusNote);
      setTicket((prev) => ({
        ...prev,
        status: newStatus,
        statusHistory: [
          ...(prev.statusHistory || []),
          { status: newStatus, changedAt: new Date().toISOString(), note: statusNote },
        ],
      }));
      setStatusModalOpen(false);
      setStatusNote('');
    } catch (err) {
      console.error('Failed to update ticket status:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" label="Loading Ticket Details..." className="min-h-[60vh]" />;
  }

  if (!ticket) {
    return (
      <div className="p-8 text-center glass-card rounded-2xl border border-slate-800">
        <h3 className="text-lg font-bold text-slate-100">Ticket Not Found</h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">The ticket ID specified could not be located.</p>
        <Link to="/tickets">
          <Button variant="outline" icon={ArrowLeft}>
            Back to Tickets
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/tickets')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-brand-400">{ticket.ticketNumber}</span>
              <Badge status={ticket.priority} size="sm" />
              <Badge status={ticket.status} size="sm" />
            </div>
            <h1 className="text-xl font-bold text-slate-100 mt-1">{ticket.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => setStatusModalOpen(true)}>
            Update Status
          </Button>
          <Link to={`/tickets/${ticket._id}/edit`}>
            <Button variant="outline" icon={Edit}>
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scope & Attachments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Problem Description & Scope</h3>
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">{ticket.description}</p>

            {ticket.resolutionNotes && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Resolution Summary:
                </p>
                <p>{ticket.resolutionNotes}</p>
              </div>
            )}
          </div>

          {/* Attachments */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                <span>Site Attachments & Photos</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ticket.attachments.map((att, idx) => (
                  <a key={idx} href={att.url} target="_blank" rel="noreferrer" className="group block rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                    <img src={att.url} alt={att.caption || 'Attachment'} className="w-full h-28 object-cover group-hover:scale-105 transition-transform" />
                    {att.caption && <p className="p-2 text-[10px] text-slate-400 truncate">{att.caption}</p>}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Status Timeline */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-400" />
              <span>Status Transition Audit Trail</span>
            </h3>
            <div className="space-y-4 pl-2 border-l-2 border-slate-800">
              {(ticket.statusHistory || []).map((hist, idx) => (
                <div key={idx} className="relative pl-6">
                  <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-brand-500 border-2 border-slate-950" />
                  <div className="flex items-center justify-between">
                    <Badge status={hist.status} size="sm" />
                    <span className="text-[10px] text-slate-500">{formatDate(hist.changedAt, true)}</span>
                  </div>
                  {hist.note && <p className="text-xs text-slate-400 mt-1 italic">"{hist.note}"</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Metadata Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Metadata & Logistics</h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-slate-500">Scheduled Time</p>
                  <p className="font-medium text-slate-200">{formatDate(ticket.scheduledAt, true)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-slate-500">Service Location Address</p>
                  <p className="font-medium text-slate-200">
                    {ticket.serviceAddress?.line1 || 'N/A'}, {ticket.serviceAddress?.city}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-slate-500">Customer ID</p>
                  <p className="font-medium text-slate-200">{ticket.customer?._id || ticket.customer}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-slate-500">Assigned Technician</p>
                  <p className="font-medium text-slate-200">{ticket.assignedTechnician?._id || ticket.assignedTechnician || 'Unassigned'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      <Modal isOpen={statusModalOpen} onClose={() => setStatusModalOpen(false)} title="Update Ticket Status" maxWidth="max-w-md">
        <div className="space-y-4">
          <Select label="Select New Status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            {Object.values(TICKET_STATUS).map((st) => (
              <option key={st} value={st}>
                {st.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </Select>

          <Textarea
            label="Transition Note (Optional)"
            placeholder="Reason for status change or field progress updates..."
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            rows={3}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateStatus} isLoading={updating}>
              Confirm Update
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
