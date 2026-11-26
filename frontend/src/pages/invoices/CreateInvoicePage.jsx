import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InvoiceForm } from '../../components/forms/InvoiceForm';
import { invoiceService } from '../../services/invoice.service';
import { customerService } from '../../services/customer.service';
import { ticketService } from '../../services/ticket.service';
import { installationService } from '../../services/installation.service';
import { Spinner } from '../../components/common/Spinner';
import { ArrowLeft } from 'lucide-react';

export const CreateInvoicePage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [installations, setInstallations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadFormData() {
      try {
        const [custRes, tktRes, instRes] = await Promise.all([
          customerService.getAll(),
          ticketService.getAll(),
          installationService.getAll(),
        ]);
        setCustomers(custRes.data?.data || []);
        setTickets(tktRes.data?.data || []);
        setInstallations(instRes.data?.data || []);
      } catch (err) {
        console.error('Failed to load invoice form options:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFormData();
  }, []);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await invoiceService.create(formData);
      navigate('/invoices');
    } catch (err) {
      console.error('Failed to create invoice:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" label="Preparing Invoice Form..." className="min-h-[60vh]" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/invoices')}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Create Tax Invoice</h1>
          <p className="text-xs text-slate-400 mt-0.5">Generate a new GST invoice with custom line items.</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-slate-800">
        <InvoiceForm
          customers={customers}
          tickets={tickets}
          installations={installations}
          onSubmit={handleSubmit}
          isLoading={submitting}
        />
      </div>
    </div>
  );
};
