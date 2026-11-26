import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CustomerForm } from '../../components/forms/CustomerForm';
import { customerService } from '../../services/customer.service';
import { Spinner } from '../../components/common/Spinner';
import { ArrowLeft } from 'lucide-react';

export const EditCustomerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const res = await customerService.getById(id);
        if (res.data?.data) {
          setCustomer(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load customer profile:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomer();
  }, [id]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await customerService.update(id, formData);
      navigate(`/customers/${id}`);
    } catch (err) {
      console.error('Failed to update customer:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" label="Fetching Customer Profile..." className="min-h-[60vh]" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/customers/${id}`)}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Edit Customer #{customer?.customerCode}</h1>
          <p className="text-xs text-slate-400 mt-0.5">Update contact details, GSTIN, or billing addresses.</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-slate-800">
        <CustomerForm initialValues={customer || {}} onSubmit={handleSubmit} isLoading={submitting} />
      </div>
    </div>
  );
};
