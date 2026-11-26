export function validateInvoice(values) {
  const errors = {};
  if (!values.customer) {
    errors.customer = 'Customer selection is required';
  }

  if (!values.dueDate) {
    errors.dueDate = 'Payment due date is required';
  }

  if (!values.lineItems || values.lineItems.length === 0) {
    errors.lineItems = 'At least one line item is required';
  } else {
    const itemErrors = [];
    values.lineItems.forEach((item, idx) => {
      const err = {};
      if (!item.description || !item.description.trim()) {
        err.description = 'Description is required';
      }
      if (!item.quantity || Number(item.quantity) <= 0) {
        err.quantity = 'Qty must be > 0';
      }
      if (item.unitPrice === undefined || Number(item.unitPrice) < 0) {
        err.unitPrice = 'Price must be >= 0';
      }
      if (Object.keys(err).length > 0) {
        itemErrors[idx] = err;
      }
    });
    if (itemErrors.length > 0) {
      errors.lineItemDetails = itemErrors;
    }
  }

  return errors;
}
