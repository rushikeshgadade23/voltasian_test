import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { validateTechnician } from '../../validations/technician.validation';
import { TECHNICIAN_AVAILABILITY } from '../../constants/enums';

export const TechnicianForm = ({ initialValues = {}, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: initialValues.user?.name || initialValues.name || '',
    email: initialValues.user?.email || initialValues.email || '',
    phone: initialValues.user?.phone || initialValues.phone || '',
    skills: (initialValues.skills || []).join(', '),
    serviceRegions: (initialValues.serviceRegions || []).join(', '),
    availability: initialValues.availability || TECHNICIAN_AVAILABILITY.AVAILABLE,
    workingHoursStart: initialValues.workingHours?.start || '09:00',
    workingHoursEnd: initialValues.workingHours?.end || '18:00',
    maxConcurrentTickets: initialValues.maxConcurrentTickets || 5,
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
    const skillsList = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const regionsList = formData.serviceRegions
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    const preparedData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      skills: skillsList,
      serviceRegions: regionsList,
      availability: formData.availability,
      workingHours: {
        start: formData.workingHoursStart,
        end: formData.workingHoursEnd,
      },
      maxConcurrentTickets: Number(formData.maxConcurrentTickets) || 5,
    };

    const validationErrors = validateTechnician(preparedData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(preparedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Technician Full Name"
          placeholder="e.g., Rajesh Kumar"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="rajesh@voltasion.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
        />

        <Input
          label="Phone Number"
          placeholder="+91 91234 56789"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          error={errors.phone}
        />

        <Select
          label="Availability Status"
          value={formData.availability}
          onChange={(e) => handleChange('availability', e.target.value)}
        >
          {Object.values(TECHNICIAN_AVAILABILITY).map((a) => (
            <option key={a} value={a}>
              {a.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </Select>

        <div className="md:col-span-2">
          <Input
            label="Skills & Expertise (Comma Separated)"
            placeholder="HVAC Installation, Solar Inverter Maintenance, High Voltage Wiring"
            value={formData.skills}
            onChange={(e) => handleChange('skills', e.target.value)}
            error={errors.skills}
          />
        </div>

        <div className="md:col-span-2">
          <Input
            label="Assigned Service Regions (Comma Separated)"
            placeholder="Bengaluru East, Whitefield, Indiranagar"
            value={formData.serviceRegions}
            onChange={(e) => handleChange('serviceRegions', e.target.value)}
          />
        </div>

        <Input
          label="Work Shift Start"
          type="time"
          value={formData.workingHoursStart}
          onChange={(e) => handleChange('workingHoursStart', e.target.value)}
        />

        <Input
          label="Work Shift End"
          type="time"
          value={formData.workingHoursEnd}
          onChange={(e) => handleChange('workingHoursEnd', e.target.value)}
        />

        <Input
          label="Max Concurrent Tickets"
          type="number"
          min="1"
          max="20"
          value={formData.maxConcurrentTickets}
          onChange={(e) => handleChange('maxConcurrentTickets', e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
        <Button type="submit" variant="primary" isLoading={isLoading} size="lg">
          {initialValues._id ? 'Save Technician' : 'Add Technician'}
        </Button>
      </div>
    </form>
  );
};
