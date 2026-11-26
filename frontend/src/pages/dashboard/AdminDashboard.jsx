import React, { useState, useEffect } from 'react';
import { StatCard } from '../../components/cards/StatCard';
import { TicketCard } from '../../components/cards/TicketCard';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/common/Spinner';
import { ticketService } from '../../services/ticket.service';
import { customerService } from '../../services/customer.service';
import { technicianService } from '../../services/technician.service';
import { invoiceService } from '../../services/invoice.service';
import { formatCurrency } from '../../utils/formatters';
import {
  Ticket,
  Users,
  Wrench,
  DollarSign,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Activity,
  CheckCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    activeCustomers: 0,
    availableTechs: 0,
    monthlyRevenue: 0,
  });
  const [recentTickets, setRecentTickets] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [ticketsRes, customersRes, techsRes, invoicesRes] = await Promise.all([
          ticketService.getAll(),
          customerService.getAll(),
          technicianService.getAll(),
          invoiceService.getAll(),
        ]);

        const tickets = ticketsRes.data?.data || [];
        const customers = customersRes.data?.data || [];
        const techs = techsRes.data?.data || [];
        const invoices = invoicesRes.data?.data || [];

        const openCount = tickets.filter((t) => ['open', 'assigned', 'in_progress'].includes(t.status)).length;
        const availableCount = techs.filter((t) => t.availability === 'available').length;
        const revenue = invoices
          .filter((inv) => inv.status === 'paid' || inv.status === 'partially_paid')
          .reduce((sum, inv) => sum + (inv.amountPaid || 0), 0);

        setStats({
          totalTickets: tickets.length,
          openTickets: openCount,
          activeCustomers: customers.length,
          availableTechs: availableCount,
          monthlyRevenue: revenue,
        });

        setRecentTickets(tickets.slice(0, 4));
      } catch (err) {
        console.error('Failed to load admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return <Spinner size="lg" label="Loading Executive Dashboard..." className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-8">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-panel rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 font-sans tracking-tight">Executive Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time operational summary across equipment, service tickets, and revenue.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link to="/tickets/create">
            <Button variant="primary" icon={Plus}>
              New Ticket
            </Button>
          </Link>
          <Link to="/invoices/create">
            <Button variant="secondary" icon={DollarSign}>
              Create Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Tickets"
          value={stats.openTickets}
          change="+12% this week"
          trend="up"
          icon={Ticket}
          color="brand"
          subtext={`Out of ${stats.totalTickets} total`}
        />
        <StatCard
          title="Active Customers"
          value={stats.activeCustomers}
          change="+5 new"
          trend="up"
          icon={Users}
          color="sky"
          subtext="Corporate & Residential"
        />
        <StatCard
          title="Available Techs"
          value={stats.availableTechs}
          icon={Wrench}
          color="emerald"
          subtext="Ready for dispatch"
        />
        <StatCard
          title="Total Revenue Collected"
          value={formatCurrency(stats.monthlyRevenue)}
          change="+18.4%"
          trend="up"
          icon={TrendingUp}
          color="purple"
          subtext="Current Billing Cycle"
        />
      </div>

      {/* Recent Tickets Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-400" />
            <h2 className="text-lg font-bold text-slate-100">Recent Service Tickets</h2>
          </div>
          <Link to="/tickets" className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1">
            View All Tickets
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentTickets.map((t) => (
            <TicketCard key={t._id} ticket={t} />
          ))}
        </div>
      </div>
    </div>
  );
};
