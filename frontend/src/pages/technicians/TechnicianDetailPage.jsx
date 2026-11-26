import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { technicianService } from '../../services/technician.service';
import { ticketService } from '../../services/ticket.service';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/common/Avatar';
import { Spinner } from '../../components/common/Spinner';
import { TicketCard } from '../../components/cards/TicketCard';
import {
  Wrench,
  Mail,
  Phone,
  Clock,
  Star,
  ShieldCheck,
  Edit,
  ArrowLeft,
  Award,
  MapPin,
} from 'lucide-react';

export const TechnicianDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [technician, setTechnician] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTechnicianDetail() {
      try {
        const [techRes, tktsRes] = await Promise.all([
          technicianService.getById(id),
          ticketService.getAll(),
        ]);

        if (techRes.data?.data) {
          setTechnician(techRes.data.data);
        }

        const allTkts = tktsRes.data?.data || [];
        setTickets(allTkts.filter((t) => t.assignedTechnician === id || t.assignedTechnician?._id === id));
      } catch (err) {
        console.error('Failed to load technician profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTechnicianDetail();
  }, [id]);

  if (loading) {
    return <Spinner size="lg" label="Loading Technician Profile..." className="min-h-[60vh]" />;
  }

  if (!technician) {
    return (
      <div className="p-8 text-center glass-card rounded-2xl border border-slate-800">
        <h3 className="text-lg font-bold text-slate-100">Technician Not Found</h3>
        <Link to="/technicians">
          <Button variant="outline" icon={ArrowLeft} className="mt-4">
            Back to Technicians
          </Button>
        </Link>
      </div>
    );
  }

  const name = technician.user?.name || technician.employeeCode;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="p-6 glass-panel rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/technicians')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <Avatar src={technician.user?.avatar} name={name} status={technician.availability} size="xl" />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-brand-400">{technician.employeeCode}</span>
              <Badge status={technician.availability} size="sm" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-100 mt-1">{name}</h1>
          </div>
        </div>

        <Link to={`/technicians/${technician._id}/edit`}>
          <Button variant="outline" icon={Edit}>
            Edit Profile
          </Button>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Contact & Shift Info</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-500" />
                <span>{technician.user?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-500" />
                <span>{technician.user?.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Shift: {technician.workingHours?.start || '09:00'} - {technician.workingHours?.end || '18:00'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Rating: <strong className="text-slate-100">{technician.rating?.average || 5.0}</strong> ({technician.rating?.count || 0} reviews)</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-400" />
              <span>Certifications</span>
            </h3>
            <div className="space-y-2">
              {(technician.certifications || []).map((cert, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <p className="font-semibold text-slate-200">{cert.name}</p>
                  <p className="text-slate-400 text-[11px]">Issued by: {cert.issuedBy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Assigned Tickets */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-slate-100">Assigned Service Tickets ({tickets.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.map((t) => (
              <TicketCard key={t._id} ticket={t} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
