export function validateTechnician(values) {
  const errors = {};
  if (!values.name || !values.name.trim()) {
    errors.name = 'Technician name is required';
  }

  if (!values.email) {
    errors.email = 'Email address is required';
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.phone) {
    errors.phone = 'Phone number is required';
  }

  if (!values.skills || (Array.isArray(values.skills) && values.skills.length === 0)) {
    errors.skills = 'At least one skill must be specified';
  }

  return errors;
}
