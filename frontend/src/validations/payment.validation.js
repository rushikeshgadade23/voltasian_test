export function validatePayment(values) {
  const errors = {};
  if (!values.invoice) {
    errors.invoice = 'Invoice selection is required';
  }

  if (!values.customer) {
    errors.customer = 'Customer selection is required';
  }

  if (!values.amount || Number(values.amount) <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }

  if (!values.method) {
    errors.method = 'Payment method is required';
  }

  return errors;
}
