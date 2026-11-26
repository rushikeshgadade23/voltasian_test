import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TechnicianForm } from '../../components/forms/TechnicianForm';
import { technicianService } from '../../services/technician.service';
import { Spinner } from '../../components/common/Spinner';
import { ArrowLeft } from 'lucide-react';

export const EditTechnicianPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [technician, setTechnician] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchTechnician() {
      try {
        const res = await technicianService.getById(id);
        if (res.data?.data) {
          setTechnician(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load technician profile:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTechnician();
  }, [id]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await technicianService.update(id, formData);
      navigate(`/technicians/${id}`);
    } catch (err) {
      console.error('Failed to update technician profile:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" label="Fetching Technician Details..." className="min-h-[60vh]" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/technicians/${id}`)}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Edit Technician #{technician?.employeeCode}</h1>
          <p className="text-xs text-slate-400 mt-0.5">Modify skills, regions, shift hours, or availability.</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-slate-800">
        <TechnicianForm initialValues={technician || {}} onSubmit={handleSubmit} isLoading={submitting} />
      </div>
    </div>
  );
};
