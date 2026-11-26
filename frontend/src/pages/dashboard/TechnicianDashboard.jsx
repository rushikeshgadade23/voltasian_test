import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/cards/StatCard';
import { TicketCard } from '../../components/cards/TicketCard';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/common/Spinner';
import { ticketService } from '../../services/ticket.service';
import { technicianService } from '../../services/technician.service';
import { Wrench, CheckCircle, Clock, Calendar, Shield, MapPin } from 'lucide-react';

export const TechnicianDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [technicianData, setTechnicianData] = useState(null);
  const [assignedTickets, setAssignedTickets] = useState([]);
  const [availability, setAvailability] = useState('available');

  useEffect(() => {
    async function loadTechnicianDashboard() {
      try {
        const [techsRes, ticketsRes] = await Promise.all([
          technicianService.getAll(),
          ticketService.getAll(),
        ]);

        const techs = techsRes.data?.data || [];
        const tickets = ticketsRes.data?.data || [];

        const meTech = techs.find((t) => t.user === user?._id || t.user?._id === user?._id) || techs[0];
        if (meTech) {
          setTechnicianData(meTech);
          setAvailability(meTech.availability);
        }

        const myTickets = tickets.filter(
          (t) => t.assignedTechnician === meTech?._id || t.assignedTechnician?._id === meTech?._id
        );
        setAssignedTickets(myTickets);
      } catch (err) {
        console.error('Failed to load technician dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTechnicianDashboard();
  }, [user]);

  const handleToggleAvailability = async (newStatus) => {
    if (!technicianData) return;
    setAvailability(newStatus);
    try {
      await technicianService.toggleAvailability(technicianData._id, newStatus);
    } catch (err) {
      console.error('Failed to update availability status:', err);
    }
  };

  if (loading) {
    return <Spinner size="lg" label="Loading Field Technician Console..." className="min-h-[60vh]" />;
  }

  const activeJobs = assignedTickets.filter((t) => t.status !== 'resolved' && t.status !== 'closed');
  const completedJobs = assignedTickets.filter((t) => t.status === 'resolved' || t.status === 'closed');

  return (
    <div className="space-y-8">
      {/* Welcome Banner & Availability Toggle */}
      <div className="p-6 glass-panel rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 uppercase tracking-wider">
            <Wrench className="w-4 h-4" />
            <span>Technician Field Workspace</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-1">Welcome, {user?.name || 'Technician'}!</h1>
          <p className="text-xs text-slate-400 mt-1">
            Shift: {technicianData?.workingHours?.start || '09:00'} - {technicianData?.workingHours?.end || '18:00'} | Regions: {(technicianData?.serviceRegions || []).join(', ') || 'All Regions'}
          </p>
        </div>

        {/* Availability Controls */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-900 rounded-xl border border-slate-800">
          {['available', 'busy', 'on_leave'].map((st) => (
            <button
              key={st}
              onClick={() => handleToggleAvailability(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize cursor-pointer ${
                availability === st
                  ? st === 'available'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : st === 'busy'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Assigned Active Jobs"
          value={activeJobs.length}
          icon={Clock}
          color="brand"
          subtext="Requires field action"
        />
        <StatCard
          title="Completed Jobs"
          value={completedJobs.length}
          icon={CheckCircle}
          color="emerald"
          subtext="Total resolved tickets"
        />
        <StatCard
          title="Rating Average"
          value={`${technicianData?.rating?.average || 5.0} ★`}
          icon={Shield}
          color="amber"
          subtext={`Based on ${technicianData?.rating?.count || 0} customer reviews`}
        />
      </div>

      {/* Active Jobs Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-400" />
          <span>Active Assigned Service Jobs</span>
        </h2>

        {activeJobs.length === 0 ? (
          <div className="p-8 text-center glass-card rounded-2xl border border-slate-800 text-slate-400 text-sm">
            You currently have no pending active jobs. Enjoy your shift!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeJobs.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
