import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TicketForm } from '../../components/forms/TicketForm';
import { ticketService } from '../../services/ticket.service';
import { customerService } from '../../services/customer.service';
import { technicianService } from '../../services/technician.service';
import { Spinner } from '../../components/common/Spinner';
import { ArrowLeft } from 'lucide-react';

export const CreateTicketPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadFormData() {
      try {
        const [custRes, techRes] = await Promise.all([
          customerService.getAll(),
          technicianService.getAll(),
        ]);
        setCustomers(custRes.data?.data || []);
        setTechnicians(techRes.data?.data || []);
      } catch (err) {
        console.error('Failed to load customers or technicians:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFormData();
  }, []);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await ticketService.create(formData);
      navigate('/tickets');
    } catch (err) {
      console.error('Failed to create ticket:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" label="Preparing Ticket Form..." className="min-h-[60vh]" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/tickets')}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Create Service Ticket</h1>
          <p className="text-xs text-slate-400 mt-0.5">Register a new customer request or maintenance job.</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-slate-800">
        <TicketForm
          customers={customers}
          technicians={technicians}
          onSubmit={handleSubmit}
          isLoading={submitting}
        />
      </div>
    </div>
  );
};
