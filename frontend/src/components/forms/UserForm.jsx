import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { USER_ROLES } from '../../constants/enums';

export const UserForm = ({ initialValues = {}, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: initialValues.name || '',
    email: initialValues.email || '',
    phone: initialValues.phone || '',
    role: initialValues.role || USER_ROLES.TECHNICIAN,
    password: '',
    isActive: initialValues.isActive !== undefined ? initialValues.isActive : true,
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
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    if (!initialValues._id && (!formData.password || formData.password.length < 6)) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          placeholder="e.g., Alex Rivera"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="user@voltasion.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
        />

        <Input
          label="Phone Number"
          placeholder="+91 98765 43210"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
        />

        <Select
          label="Assigned System Role"
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
        >
          {Object.values(USER_ROLES).map((r) => (
            <option key={r} value={r}>
              {r.toUpperCase()}
            </option>
          ))}
        </Select>

        {!initialValues._id && (
          <Input
            label="Initial Account Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
          />
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
        <Button type="submit" variant="primary" isLoading={isLoading} size="lg">
          {initialValues._id ? 'Save User' : 'Create System User'}
        </Button>
      </div>
    </form>
  );
};
