export function validateInstallation(values) {
  const errors = {};

  if (!values.ticket) {
    errors.ticket = 'Associated ticket is required';
  }

  if (!values.customer) {
    errors.customer = 'Customer is required';
  }

  if (!values.technician) {
    errors.technician = 'Assigned technician is required';
  }

  // Product name is now nested under values.product
  if (!values.product || !values.product.name || !values.product.name.trim()) {
    errors.productName = 'Product name is required';
  }

  if (!values.installationDate) {
    errors.installationDate = 'Scheduled installation date is required';
  }

  return errors;
}
