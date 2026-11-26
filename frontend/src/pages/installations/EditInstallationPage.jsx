import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InstallationForm } from '../../components/forms/InstallationForm';
import { installationService } from '../../services/installation.service';
import { ticketService } from '../../services/ticket.service';
import { customerService } from '../../services/customer.service';
import { technicianService } from '../../services/technician.service';
import { Spinner } from '../../components/common/Spinner';
import { ArrowLeft } from 'lucide-react';

export const EditInstallationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [installation, setInstallation] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [instRes, tktsRes, custsRes, techsRes] = await Promise.all([
          installationService.getById(id),
          ticketService.getAll(),
          customerService.getAll(),
          technicianService.getAll(),
        ]);

        if (instRes.data?.data) {
          setInstallation(instRes.data.data);
        }
        setTickets(tktsRes.data?.data || []);
        setCustomers(custsRes.data?.data || []);
        setTechnicians(techsRes.data?.data || []);
      } catch (err) {
        console.error('Failed to load installation details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await installationService.update(id, formData);
      navigate(`/installations/${id}`);
    } catch (err) {
      console.error('Failed to update installation:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" label="Fetching Installation Details..." className="min-h-[60vh]" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/installations/${id}`)}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Edit Installation #{installation?.installationNumber}</h1>
          <p className="text-xs text-slate-400 mt-0.5">Modify serial numbers, technicians, or warranty terms.</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-slate-800">
        <InstallationForm
          initialValues={installation || {}}
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
