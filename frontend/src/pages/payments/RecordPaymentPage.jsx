import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentForm } from '../../components/forms/PaymentForm';
import { paymentService } from '../../services/payment.service';
import { invoiceService } from '../../services/invoice.service';
import { customerService } from '../../services/customer.service';
import { Spinner } from '../../components/common/Spinner';
import { ArrowLeft } from 'lucide-react';

export const RecordPaymentPage = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [invRes, custRes] = await Promise.all([
          invoiceService.getAll(),
          customerService.getAll(),
        ]);
        const allInvoices = invRes.data?.data || [];
        setInvoices(allInvoices.filter((inv) => inv.status !== 'paid'));
        setCustomers(custRes.data?.data || []);
      } catch (err) {
        console.error('Failed to load payment options:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await paymentService.recordPayment(formData);
      navigate('/payments');
    } catch (err) {
      console.error('Failed to record payment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" label="Loading Payment Console..." className="min-h-[60vh]" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/payments')}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Record Payment</h1>
          <p className="text-xs text-slate-400 mt-0.5">Log an incoming payment receipt against an open invoice.</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-slate-800">
        <PaymentForm invoices={invoices} customers={customers} onSubmit={handleSubmit} isLoading={submitting} />
      </div>
    </div>
  );
};
