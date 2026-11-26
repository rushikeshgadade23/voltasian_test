export function validateCustomer(values) {
  const errors = {};

  if (values.type === 'business' && (!values.companyName || !values.companyName.trim())) {
    errors.companyName = 'Company Name is required for business customers';
  }

  if (values.type === 'individual' && (!values.name || !values.name.trim())) {
    errors.name = 'Customer Name is required';
  }

  if (!values.email) {
    errors.email = 'Email address is required';
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.phone) {
    errors.phone = 'Phone number is required';
  }

  // Billing address fields are nested under `billingAddress`
  const billing = values.billingAddress || {};

  if (!billing.line1) {
    errors.line1 = 'Billing address line 1 is required';
  }

  if (!billing.city) {
    errors.city = 'City is required';
  }

  if (!billing.postalCode) {
    errors.postalCode = 'Postal code is required';
  }

  return errors;
}
