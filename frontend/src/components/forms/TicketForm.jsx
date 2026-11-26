import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { validateTicket } from '../../validations/ticket.validation';
import { TICKET_CATEGORY, TICKET_PRIORITY, TICKET_STATUS } from '../../constants/enums';

export const TicketForm = ({ initialValues = {}, customers = [], technicians = [], onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: initialValues.title || '',
    customer: initialValues.customer?._id || initialValues.customer || '',
    assignedTechnician: initialValues.assignedTechnician?._id || initialValues.assignedTechnician || '',
    category: initialValues.category || TICKET_CATEGORY.INSTALLATION,
    priority: initialValues.priority || TICKET_PRIORITY.MEDIUM,
    status: initialValues.status || TICKET_STATUS.OPEN,
    description: initialValues.description || '',
    scheduledAt: initialValues.scheduledAt ? new Date(initialValues.scheduledAt).toISOString().slice(0, 16) : '',
    serviceAddress: {
      line1: initialValues.serviceAddress?.line1 || '',
      city: initialValues.serviceAddress?.city || 'Bengaluru',
      state: initialValues.serviceAddress?.state || 'Karnataka',
      postalCode: initialValues.serviceAddress?.postalCode || '560001',
      country: initialValues.serviceAddress?.country || 'India',
    },
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleAddressChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      serviceAddress: { ...prev.serviceAddress, [field]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateTicket(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Ticket Title / Summary"
            placeholder="e.g., Solar Inverter Grid Commissioning"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            error={errors.title}
          />
        </div>

        <Select
          label="Customer"
          value={formData.customer}
          onChange={(e) => handleChange('customer', e.target.value)}
          error={errors.customer}
        >
          <option value="" disabled>Select Customer</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.companyName || c.user?.name || c.customerCode} ({c.customerCode})
            </option>
          ))}
        </Select>

        <Select
          label="Assign Field Technician"
          value={formData.assignedTechnician}
          onChange={(e) => handleChange('assignedTechnician', e.target.value)}
        >
          <option value="">Unassigned (Queue)</option>
          {technicians.map((t) => (
            <option key={t._id} value={t._id}>
              {t.user?.name || t.employeeCode} ({t.availability})
            </option>
          ))}
        </Select>

        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          error={errors.category}
        >
          {Object.values(TICKET_CATEGORY).map((cat) => (
            <option key={cat} value={cat}>
              {cat.toUpperCase()}
            </option>
          ))}
        </Select>

        <Select
          label="Priority"
          value={formData.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
        >
          {Object.values(TICKET_PRIORITY).map((p) => (
            <option key={p} value={p}>
              {p.toUpperCase()}
            </option>
          ))}
        </Select>

        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          {Object.values(TICKET_STATUS).map((st) => (
            <option key={st} value={st}>
              {st.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </Select>

        <Input
          label="Scheduled Time"
          type="datetime-local"
          value={formData.scheduledAt}
          onChange={(e) => handleChange('scheduledAt', e.target.value)}
        />
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-800">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">Service Location Address</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <Input
              placeholder="Address Line 1"
              value={formData.serviceAddress.line1}
              onChange={(e) => handleAddressChange('line1', e.target.value)}
            />
          </div>
          <Input
            placeholder="City"
            value={formData.serviceAddress.city}
            onChange={(e) => handleAddressChange('city', e.target.value)}
          />
          <Input
            placeholder="State"
            value={formData.serviceAddress.state}
            onChange={(e) => handleAddressChange('state', e.target.value)}
          />
          <Input
            placeholder="Postal Code"
            value={formData.serviceAddress.postalCode}
            onChange={(e) => handleAddressChange('postalCode', e.target.value)}
          />
        </div>
      </div>

      <Textarea
        label="Ticket Description & Problem Scope"
        placeholder="Provide detailed description of the service request or issue..."
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        error={errors.description}
        rows={4}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
        <Button type="submit" variant="primary" isLoading={isLoading} size="lg">
          {initialValues._id ? 'Update Ticket' : 'Create Ticket'}
        </Button>
      </div>
    </form>
  );
};
