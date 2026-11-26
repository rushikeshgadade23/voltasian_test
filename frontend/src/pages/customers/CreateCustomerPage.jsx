import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerForm } from '../../components/forms/CustomerForm';
import { customerService } from '../../services/customer.service';
import { ArrowLeft } from 'lucide-react';

export const CreateCustomerPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await customerService.create(formData);
      navigate('/customers');
    } catch (err) {
      console.error('Failed to create customer:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/customers')}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Add Customer Account</h1>
          <p className="text-xs text-slate-400 mt-0.5">Create a new corporate or individual customer profile.</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-slate-800">
        <CustomerForm onSubmit={handleSubmit} isLoading={submitting} />
      </div>
    </div>
  );
};
