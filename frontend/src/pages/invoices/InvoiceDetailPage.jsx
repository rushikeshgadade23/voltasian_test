import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { invoiceService } from '../../services/invoice.service';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/common/Spinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  FileText,
  Printer,
  CreditCard,
  ArrowLeft,
  Edit,
  Zap,
  Building,
} from 'lucide-react';

export const InvoiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvoice() {
      try {
        const res = await invoiceService.getById(id);
        if (res.data?.data) {
          setInvoice(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load invoice details:', err);
      } final: {
        setLoading(false);
      }
    }
    loadInvoice();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <Spinner size="lg" label="Generating Invoice View..." className="min-h-[60vh]" />;
  }

  if (!invoice) {
    return (
      <div className="p-8 text-center glass-card rounded-2xl border border-slate-800">
        <h3 className="text-lg font-bold text-slate-100">Invoice Not Found</h3>
        <Link to="/invoices">
          <Button variant="outline" icon={ArrowLeft} className="mt-4">
            Back to Invoices
          </Button>
        </Link>
      </div>
    );
  }

  const balanceDue = Math.max(invoice.total - (invoice.amountPaid || 0), 0);

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/invoices')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-brand-400">{invoice.invoiceNumber}</span>
              <Badge status={invoice.status} size="sm" />
            </div>
            <h1 className="text-xl font-bold text-slate-100 mt-0.5">Tax Invoice Document</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" icon={Printer} onClick={handlePrint}>
            Print Invoice
          </Button>
          {balanceDue > 0 && (
            <Link to="/payments/record">
              <Button variant="success" icon={CreditCard}>
                Record Payment
              </Button>
            </Link>
          )}
          <Link to={`/invoices/${invoice._id}/edit`}>
            <Button variant="secondary" icon={Edit}>
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 max-w-4xl mx-auto space-y-8 bg-slate-950 text-slate-100 print:bg-white print:text-black print:p-0 print:border-none">
        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-6 print:border-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">VOLTASION ENERGY SYSTEMS</h2>
              <p className="text-xs text-slate-400 print:text-slate-600">GSTIN: 27AAACV9810A1ZB | Karnataka, India</p>
            </div>
          </div>

          <div className="text-right">
            <h3 className="text-lg font-mono font-bold text-brand-400">{invoice.invoiceNumber}</h3>
            <p className="text-xs text-slate-400 print:text-slate-600 mt-1">Issue Date: {formatDate(invoice.issueDate)}</p>
            <p className="text-xs text-slate-400 print:text-slate-600">Due Date: {formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        {/* Bill To Info */}
        <div className="grid grid-cols-2 gap-6 text-xs">
          <div>
            <p className="font-semibold uppercase tracking-wider text-slate-400 print:text-slate-600 mb-1">Billed To</p>
            <p className="font-bold text-slate-100 text-sm">{invoice.customer?._id || 'Customer ID: ' + invoice.customer}</p>
            <p className="text-slate-400 print:text-slate-600 mt-1">Bengaluru, Karnataka, India</p>
          </div>

          <div className="text-right">
            <p className="font-semibold uppercase tracking-wider text-slate-400 print:text-slate-600 mb-1">Payment Status</p>
            <div className="inline-block"><Badge status={invoice.status} size="md" /></div>
            <p className="text-slate-400 print:text-slate-600 mt-1">Currency: <strong>{invoice.currency || 'INR'}</strong></p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-800 text-slate-400 uppercase tracking-wider print:border-slate-300">
                <th className="py-3">Item & Description</th>
                <th className="py-3 text-center">Qty</th>
                <th className="py-3 text-right">Unit Price (₹)</th>
                <th className="py-3 text-right">GST %</th>
                <th className="py-3 text-right">Total Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 print:divide-slate-200">
              {(invoice.lineItems || []).map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3.5 font-medium">{item.description}</td>
                  <td className="py-3.5 text-center">{item.quantity}</td>
                  <td className="py-3.5 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-3.5 text-right">{item.taxRate}%</td>
                  <td className="py-3.5 text-right font-semibold">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="flex justify-end pt-4 border-t border-slate-800 print:border-slate-300">
          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span className="font-medium text-slate-200">{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>GST Tax Total:</span>
              <span className="font-medium text-slate-200">{formatCurrency(invoice.taxTotal)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-slate-400">
                <span>Discount:</span>
                <span className="font-medium text-emerald-400">- {formatCurrency(invoice.discount)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-slate-100">
              <span>Grand Total:</span>
              <span className="text-brand-400">{formatCurrency(invoice.total)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Amount Paid:</span>
              <span className="font-medium text-emerald-400">{formatCurrency(invoice.amountPaid || 0)}</span>
            </div>
            <div className="pt-1 flex justify-between font-bold text-xs text-rose-400">
              <span>Balance Due:</span>
              <span>{formatCurrency(balanceDue)}</span>
            </div>
          </div>
        </div>

        {/* Terms & Notes */}
        {invoice.notes && (
          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 print:text-slate-600 space-y-1">
            <p className="font-semibold text-slate-300">Payment Terms & Instructions:</p>
            <p>{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};
