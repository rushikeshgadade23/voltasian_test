import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { paymentService } from '../../services/payment.service';
import { Badge } from '../../components/common/Badge';
import { SearchBar } from '../../components/common/SearchBar';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Plus, CreditCard, ArrowRight } from 'lucide-react';

export const PaymentListPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await paymentService.getAll();
        setPayments(res.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch payment records:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((p) => {
    const ref = (p.paymentReference || '').toLowerCase();
    const txn = (p.transactionId || '').toLowerCase();
    return ref.includes(searchQuery.toLowerCase()) || txn.includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const displayedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <Spinner size="lg" label="Fetching Payment Transactions..." className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 font-sans tracking-tight">Payment Transactions</h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit payment receipts, transaction references (UPI, Bank NEFT, Cheque), and gateway responses.
          </p>
        </div>

        <Link to="/payments/record">
          <Button variant="success" icon={Plus} size="md">
            Record Payment
          </Button>
        </Link>
      </div>

      <div className="p-4 glass-panel rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by payment reference or UTR transaction ID..."
        />
      </div>

      {displayedPayments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No payment receipts recorded"
          description="No transactions match your search query."
          actionLabel="Record Payment"
          onAction={() => (window.location.href = '/payments/record')}
        />
      ) : (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Amount (₹)</th>
                  <th className="p-4">Transaction UTR</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {displayedPayments.map((pay) => (
                  <tr key={pay._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-mono font-semibold text-brand-400">{pay.paymentReference}</td>
                    <td className="p-4">{formatDate(pay.paidAt)}</td>
                    <td className="p-4 uppercase font-semibold text-xs text-slate-400">{pay.method}</td>
                    <td className="p-4 font-bold text-emerald-400">{formatCurrency(pay.amount)}</td>
                    <td className="p-4 font-mono text-xs text-slate-400">{pay.transactionId || 'N/A'}</td>
                    <td className="p-4"><Badge status={pay.status} size="sm" /></td>
                    <td className="p-4 text-right">
                      <Link
                        to={`/payments/${pay._id}`}
                        className="inline-flex items-center gap-1 font-medium text-brand-400 hover:text-brand-300 transition-colors"
                      >
                        Receipt
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
        totalItems={filteredPayments.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
