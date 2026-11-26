import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { validateCustomer } from '../../validations/customer.validation';
import { CUSTOMER_TYPE, CONTACT_METHOD } from '../../constants/enums';

export const CustomerForm = ({ initialValues = {}, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    type: initialValues.type || CUSTOMER_TYPE.INDIVIDUAL,
    companyName: initialValues.companyName || '',
    gstNumber: initialValues.gstNumber || '',
    name: initialValues.user?.name || initialValues.name || '',
    email: initialValues.user?.email || initialValues.email || '',
    phone: initialValues.user?.phone || initialValues.phone || '',
    preferredContactMethod: initialValues.preferredContactMethod || CONTACT_METHOD.PHONE,
    tags: (initialValues.tags || []).join(', '),
    notes: initialValues.notes || '',
    billingAddress: {
      line1: initialValues.billingAddress?.line1 || '',
      line2: initialValues.billingAddress?.line2 || '',
      city: initialValues.billingAddress?.city || 'Bengaluru',
      state: initialValues.billingAddress?.state || 'Karnataka',
      postalCode: initialValues.billingAddress?.postalCode || '560001',
      country: initialValues.billingAddress?.country || 'India',
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
      billingAddress: { ...prev.billingAddress, [field]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const preparedData = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    const validationErrors = validateCustomer(preparedData);
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
          label="Customer Account Type"
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value)}
        >
          <option value={CUSTOMER_TYPE.INDIVIDUAL}>Individual / Residential</option>
          <option value={CUSTOMER_TYPE.BUSINESS}>Business / Commercial Entity</option>
        </Select>

        {formData.type === CUSTOMER_TYPE.BUSINESS ? (
          <>
            <Input
              label="Company Legal Name"
              placeholder="e.g., Apex Tech Pvt Ltd"
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              error={errors.companyName}
            />
            <Input
              label="GST Identification Number"
              placeholder="e.g., 27AAAAA0000A1Z5"
              value={formData.gstNumber}
              onChange={(e) => handleChange('gstNumber', e.target.value)}
            />
          </>
        ) : (
          <Input
            label="Full Name"
            placeholder="e.g., Rahul Verma"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
          />
        )}

        <Input
          label="Primary Email Address"
          type="email"
          placeholder="email@example.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
        />

        <Input
          label="Primary Contact Phone"
          placeholder="+91 98765 43210"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          error={errors.phone}
        />

        <Select
          label="Preferred Contact Channel"
          value={formData.preferredContactMethod}
          onChange={(e) => handleChange('preferredContactMethod', e.target.value)}
        >
          {Object.values(CONTACT_METHOD).map((m) => (
            <option key={m} value={m}>
              {m.toUpperCase()}
            </option>
          ))}
        </Select>

        <Input
          label="Tags (Comma Separated)"
          placeholder="VIP, Enterprise, Annual Contract"
          value={formData.tags}
          onChange={(e) => handleChange('tags', e.target.value)}
        />
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-800">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">Billing Address</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Address Line 1 *"
            value={formData.billingAddress.line1}
            onChange={(e) => handleAddressChange('line1', e.target.value)}
            error={errors.line1}
          />
          <Input
            placeholder="Address Line 2"
            value={formData.billingAddress.line2}
            onChange={(e) => handleAddressChange('line2', e.target.value)}
          />
          <Input
            placeholder="City *"
            value={formData.billingAddress.city}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            error={errors.city}
          />
          <Input
            placeholder="State"
            value={formData.billingAddress.state}
            onChange={(e) => handleAddressChange('state', e.target.value)}
          />
          <Input
            placeholder="Postal Code *"
            value={formData.billingAddress.postalCode}
            onChange={(e) => handleAddressChange('postalCode', e.target.value)}
            error={errors.postalCode}
          />
          <Input
            placeholder="Country"
            value={formData.billingAddress.country}
            onChange={(e) => handleAddressChange('country', e.target.value)}
          />
        </div>
      </div>

      <Textarea
        label="Internal Account Notes"
        placeholder="Special preferences, gate codes, site instructions..."
        value={formData.notes}
        onChange={(e) => handleChange('notes', e.target.value)}
        rows={3}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
        <Button type="submit" variant="primary" isLoading={isLoading} size="lg">
          {initialValues._id ? 'Save Customer' : 'Add Customer'}
        </Button>
      </div>
    </form>
  );
};
