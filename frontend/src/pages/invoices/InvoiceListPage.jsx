import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { invoiceService } from '../../services/invoice.service';
import { Badge } from '../../components/common/Badge';
import { SearchBar } from '../../components/common/SearchBar';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Plus, FileText, Calendar, ArrowRight } from 'lucide-react';
import { INVOICE_STATUS } from '../../constants/enums';

export const InvoiceListPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await invoiceService.getAll();
        setInvoices(res.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch invoices:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter((inv) => {
    const invNum = (inv.invoiceNumber || '').toLowerCase();
    const custId = String(inv.customer?._id || inv.customer || '').toLowerCase();
    const matchesSearch = invNum.includes(searchQuery.toLowerCase()) || custId.includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const displayedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <Spinner size="lg" label="Fetching Invoices & Billing..." className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 font-sans tracking-tight">Invoices & Billing</h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate printable GST invoices, manage line items, track partial payments, and handle balance dues.
          </p>
        </div>

        <Link to="/invoices/create">
          <Button variant="primary" icon={Plus} size="md">
            Create Invoice
          </Button>
        </Link>
      </div>

      <div className="p-4 glass-panel rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by invoice # or customer ID..."
        />

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-48 py-1.5 text-xs"
        >
          <option value="">All Statuses</option>
          {Object.values(INVOICE_STATUS).map((st) => (
            <option key={st} value={st}>
              {st.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </Select>
      </div>

      {displayedInvoices.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No invoices found"
          description="No invoice records match your search filters."
          actionLabel="Create Invoice"
          onAction={() => (window.location.href = '/invoices/create')}
        />
      ) : (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Invoice #</th>
                  <th className="p-4">Issue Date</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Total (₹)</th>
                  <th className="p-4">Amount Paid</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {displayedInvoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-mono font-semibold text-brand-400">{inv.invoiceNumber}</td>
                    <td className="p-4">{formatDate(inv.issueDate)}</td>
                    <td className="p-4">{formatDate(inv.dueDate)}</td>
                    <td className="p-4 font-bold text-slate-100">{formatCurrency(inv.total)}</td>
                    <td className="p-4 font-medium text-emerald-400">{formatCurrency(inv.amountPaid || 0)}</td>
                    <td className="p-4"><Badge status={inv.status} size="sm" /></td>
                    <td className="p-4 text-right">
                      <Link
                        to={`/invoices/${inv._id}`}
                        className="inline-flex items-center gap-1 font-medium text-brand-400 hover:text-brand-300 transition-colors"
                      >
                        View / Print
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredInvoices.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
