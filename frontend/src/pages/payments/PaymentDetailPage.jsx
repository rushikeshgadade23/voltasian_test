import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { paymentService } from '../../services/payment.service';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/common/Spinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CreditCard, Printer, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const PaymentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPayment() {
      try {
        const res = await paymentService.getById(id);
        if (res.data?.data) {
          setPayment(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load payment details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPayment();
  }, [id]);

  if (loading) {
    return <Spinner size="lg" label="Generating Payment Receipt..." className="min-h-[60vh]" />;
  }

  if (!payment) {
    return (
      <div className="p-8 text-center glass-card rounded-2xl border border-slate-800">
        <h3 className="text-lg font-bold text-slate-100">Payment Receipt Not Found</h3>
        <Link to="/payments">
          <Button variant="outline" icon={ArrowLeft} className="mt-4">
            Back to Payments
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/payments')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-xl font-bold text-slate-100">Payment Receipt</h1>
        </div>

        <Button variant="outline" icon={Printer} onClick={() => window.print()}>
          Print Receipt
        </Button>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-6 bg-slate-950 text-slate-100 print:bg-white print:text-black">
        <div className="text-center space-y-2 border-b border-slate-800 pb-6 print:border-slate-300">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">{formatCurrency(payment.amount)}</h2>
          <p className="text-xs font-mono font-semibold text-brand-400">{payment.paymentReference}</p>
          <div className="inline-block mt-2"><Badge status={payment.status} size="sm" /></div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex justify-between py-2 border-b border-slate-800/60">
            <span className="text-slate-400">Date Paid:</span>
            <span className="font-semibold text-slate-200">{formatDate(payment.paidAt, true)}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-800/60">
            <span className="text-slate-400">Payment Method:</span>
            <span className="font-semibold text-slate-200 uppercase">{payment.method}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-800/60">
            <span className="text-slate-400">Transaction UTR / Reference:</span>
            <span className="font-mono font-semibold text-slate-200">{payment.transactionId || 'N/A'}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-800/60">
            <span className="text-slate-400">Associated Invoice:</span>
            <span className="font-mono font-semibold text-brand-400">{payment.invoice?._id || payment.invoice}</span>
          </div>
        </div>

        {payment.notes && (
          <div className="pt-2 text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Notes:</p>
            <p className="italic">{payment.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};
