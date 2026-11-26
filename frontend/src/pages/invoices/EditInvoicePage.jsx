import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InvoiceForm } from '../../components/forms/InvoiceForm';
import { invoiceService } from '../../services/invoice.service';
import { customerService } from '../../services/customer.service';
import { ticketService } from '../../services/ticket.service';
import { installationService } from '../../services/installation.service';
import { Spinner } from '../../components/common/Spinner';
import { ArrowLeft } from 'lucide-react';

export const EditInvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [installations, setInstallations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [invRes, custRes, tktRes, instRes] = await Promise.all([
          invoiceService.getById(id),
          customerService.getAll(),
          ticketService.getAll(),
          installationService.getAll(),
        ]);

        if (invRes.data?.data) {
          setInvoice(invRes.data.data);
        }
        setCustomers(custRes.data?.data || []);
        setTickets(tktRes.data?.data || []);
        setInstallations(instRes.data?.data || []);
      } catch (err) {
        console.error('Failed to load invoice edit data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await invoiceService.update(id, formData);
      navigate(`/invoices/${id}`);
    } catch (err) {
      console.error('Failed to update invoice:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" label="Fetching Invoice Data..." className="min-h-[60vh]" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/invoices/${id}`)}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Edit Invoice #{invoice?.invoiceNumber}</h1>
          <p className="text-xs text-slate-400 mt-0.5">Modify line items, prices, or payment terms.</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-slate-800">
        <InvoiceForm
          initialValues={invoice || {}}
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
