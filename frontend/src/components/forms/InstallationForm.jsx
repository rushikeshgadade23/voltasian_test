import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { validateInstallation } from '../../validations/installation.validation';
import { INSTALLATION_STATUS } from '../../constants/enums';

export const InstallationForm = ({
  initialValues = {},
  tickets = [],
  customers = [],
  technicians = [],
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    ticket: initialValues.ticket?._id || initialValues.ticket || '',
    customer: initialValues.customer?._id || initialValues.customer || '',
    technician: initialValues.technician?._id || initialValues.technician || '',
    productName: initialValues.product?.name || '',
    productModel: initialValues.product?.model || '',
    serialNumber: initialValues.product?.serialNumber || '',
    manufacturer: initialValues.product?.manufacturer || 'Voltasion',
    quantity: initialValues.quantity || 1,
    installationDate: initialValues.installationDate ? new Date(initialValues.installationDate).toISOString().slice(0, 16) : '',
    warrantyTerms: initialValues.warranty?.terms || '1-year comprehensive manufacturer warranty',
    status: initialValues.status || INSTALLATION_STATUS.SCHEDULED,
    notes: initialValues.notes || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const preparedData = {
      ticket: formData.ticket,
      customer: formData.customer,
      technician: formData.technician,
      product: {
        name: formData.productName,
        model: formData.productModel,
        serialNumber: formData.serialNumber,
        manufacturer: formData.manufacturer,
      },
      quantity: Number(formData.quantity) || 1,
      installationDate: formData.installationDate,
      warranty: {
        startDate: formData.installationDate,
        terms: formData.warrantyTerms,
      },
      status: formData.status,
      notes: formData.notes,
    };

    const validationErrors = validateInstallation(preparedData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(preparedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Associated Service Ticket"
          value={formData.ticket}
          onChange={(e) => handleChange('ticket', e.target.value)}
          error={errors.ticket}
        >
          <option value="" disabled>Select Ticket</option>
          {tickets.map((t) => (
            <option key={t._id} value={t._id}>
              {t.ticketNumber} — {t.title}
            </option>
          ))}
        </Select>

        <Select
          label="Customer"
          value={formData.customer}
          onChange={(e) => handleChange('customer', e.target.value)}
          error={errors.customer}
        >
          <option value="" disabled>Select Customer</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.companyName || c.user?.name || c.customerCode}
            </option>
          ))}
        </Select>

        <Select
          label="Assigned Lead Technician"
          value={formData.technician}
          onChange={(e) => handleChange('technician', e.target.value)}
          error={errors.technician}
        >
          <option value="" disabled>Select Technician</option>
          {technicians.map((t) => (
            <option key={t._id} value={t._id}>
              {t.user?.name || t.employeeCode}
            </option>
          ))}
        </Select>

        <Select
          label="Installation Status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          {Object.values(INSTALLATION_STATUS).map((st) => (
            <option key={st} value={st}>
              {st.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </Select>

        <div className="md:col-span-2 space-y-4 pt-2 border-t border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">Product / Equipment Details</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              placeholder="e.g., Voltasion Sol-Pro 10kW Hybrid Inverter"
              value={formData.productName}
              onChange={(e) => handleChange('productName', e.target.value)}
              error={errors.productName}
            />
            <Input
              label="Model Number"
              placeholder="e.g., VSP-10K-HYBRID"
              value={formData.productModel}
              onChange={(e) => handleChange('productModel', e.target.value)}
            />
            <Input
              label="Serial Number"
              placeholder="e.g., SN-2026-981240"
              value={formData.serialNumber}
              onChange={(e) => handleChange('serialNumber', e.target.value)}
            />
            <Input
              label="Manufacturer"
              placeholder="Voltasion Green Energy"
              value={formData.manufacturer}
              onChange={(e) => handleChange('manufacturer', e.target.value)}
            />
          </div>
        </div>

        <Input
          label="Scheduled Installation Date & Time"
          type="datetime-local"
          value={formData.installationDate}
          onChange={(e) => handleChange('installationDate', e.target.value)}
          error={errors.installationDate}
        />

        <Input
          label="Quantity"
          type="number"
          min="1"
          value={formData.quantity}
          onChange={(e) => handleChange('quantity', e.target.value)}
        />

        <div className="md:col-span-2">
          <Input
            label="Warranty Terms & Conditions"
            placeholder="5-year comprehensive warranty covering parts and labor."
            value={formData.warrantyTerms}
            onChange={(e) => handleChange('warrantyTerms', e.target.value)}
          />
        </div>
      </div>

      <Textarea
        label="Installation Special Notes"
        placeholder="Site structural clearance, electrical meter panel location..."
        value={formData.notes}
        onChange={(e) => handleChange('notes', e.target.value)}
        rows={3}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
        <Button type="submit" variant="primary" isLoading={isLoading} size="lg">
          {initialValues._id ? 'Save Installation' : 'Schedule Installation'}
        </Button>
      </div>
    </form>
  );
};
