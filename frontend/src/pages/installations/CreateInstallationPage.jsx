import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InstallationForm } from '../../components/forms/InstallationForm';
import { installationService } from '../../services/installation.service';
import { ticketService } from '../../services/ticket.service';
import { customerService } from '../../services/customer.service';
import { technicianService } from '../../services/technician.service';
import { Spinner } from '../../components/common/Spinner';
import { ArrowLeft } from 'lucide-react';

export const CreateInstallationPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadDropdowns() {
      try {
        const [tktsRes, custsRes, techsRes] = await Promise.all([
          ticketService.getAll(),
          customerService.getAll(),
          technicianService.getAll(),
        ]);
        setTickets(tktsRes.data?.data || []);
        setCustomers(custsRes.data?.data || []);
        setTechnicians(techsRes.data?.data || []);
      } catch (err) {
        console.error('Failed to load installation form dropdowns:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDropdowns();
  }, []);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await installationService.create(formData);
      navigate('/installations');
    } catch (err) {
      console.error('Failed to schedule installation:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" label="Preparing Installation Form..." className="min-h-[60vh]" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/installations')}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Schedule Installation</h1>
          <p className="text-xs text-slate-400 mt-0.5">Register a new equipment commissioning job.</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-slate-800">
        <InstallationForm
          tickets={tickets}
          customers={customers}
          technicians={technicians}
          onSubmit={handleSubmit}
          isLoading={submitting}
        />
      </div>
    </div>
  );
};
