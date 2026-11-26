import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { customerService } from '../../services/customer.service';
import { ticketService } from '../../services/ticket.service';
import { invoiceService } from '../../services/invoice.service';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/common/Avatar';
import { Spinner } from '../../components/common/Spinner';
import { Tabs } from '../../components/common/Tabs';
import { TicketCard } from '../../components/cards/TicketCard';
import { formatAddress, formatCurrency, formatDate } from '../../utils/formatters';
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Edit,
  ArrowLeft,
  Ticket,
  FileText,
  Building,
} from 'lucide-react';

export const CustomerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function loadCustomerDetail() {
      try {
        const [custRes, tktsRes, invsRes] = await Promise.all([
          customerService.getById(id),
          ticketService.getAll(),
          invoiceService.getAll(),
        ]);

        if (custRes.data?.data) {
          setCustomer(custRes.data.data);
        }

        const allTkts = tktsRes.data?.data || [];
        const allInvs = invsRes.data?.data || [];

        setTickets(allTkts.filter((t) => t.customer === id || t.customer?._id === id));
        setInvoices(allInvs.filter((inv) => inv.customer === id || inv.customer?._id === id));
      } catch (err) {
        console.error('Failed to load customer profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCustomerDetail();
  }, [id]);

  if (loading) {
    return <Spinner size="lg" label="Loading Customer Profile..." className="min-h-[60vh]" />;
  }

  if (!customer) {
    return (
      <div className="p-8 text-center glass-card rounded-2xl border border-slate-800">
        <h3 className="text-lg font-bold text-slate-100">Customer Not Found</h3>
        <Link to="/customers">
          <Button variant="outline" icon={ArrowLeft} className="mt-4">
            Back to Customers
          </Button>
        </Link>
      </div>
    );
  }

  const name = customer.type === 'business' ? customer.companyName : customer.user?.name || customer.customerCode;

  const tabs = [
    { id: 'overview', label: 'Overview & Addresses', icon: Building },
    { id: 'tickets', label: 'Service Tickets', icon: Ticket, count: tickets.length },
    { id: 'invoices', label: 'Invoices & Billing', icon: FileText, count: invoices.length },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="p-6 glass-panel rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/customers')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <Avatar name={name} size="xl" />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-brand-400">{customer.customerCode}</span>
              <Badge variant={customer.type === 'business' ? 'info' : 'secondary'} size="sm">
                {customer.type}
              </Badge>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-100 mt-1">{name}</h1>
          </div>
        </div>

        <Link to={`/customers/${customer._id}/edit`}>
          <Button variant="outline" icon={Edit}>
            Edit Profile
          </Button>
        </Link>
      </div>

      {/* Navigation Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Contact Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-4 h-4 text-slate-500" />
                <span>{customer.user?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-4 h-4 text-slate-500" />
                <span>{customer.user?.phone || 'N/A'}</span>
              </div>
              {customer.gstNumber && (
                <div className="flex items-center gap-3 text-slate-300">
                  <Building className="w-4 h-4 text-slate-500" />
                  <span>GSTIN: <span className="font-mono text-brand-400">{customer.gstNumber}</span></span>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Billing Address</h3>
            <div className="flex items-start gap-3 text-sm text-slate-300">
              <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
              <span>{formatAddress(customer.billingAddress)}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.map((t) => (
            <TicketCard key={t._id} ticket={t} />
          ))}
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Issue Date</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {invoices.map((inv) => (
                <tr key={inv._id} className="hover:bg-slate-900/40">
                  <td className="p-4 font-mono font-semibold text-brand-400">{inv.invoiceNumber}</td>
                  <td className="p-4">{formatDate(inv.issueDate)}</td>
                  <td className="p-4 font-bold text-slate-100">{formatCurrency(inv.total)}</td>
                  <td className="p-4"><Badge status={inv.status} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
