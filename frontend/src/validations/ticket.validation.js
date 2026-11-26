export function validateTicket(values) {
  const errors = {};
  if (!values.title || !values.title.trim()) {
    errors.title = 'Title is required';
  } else if (values.title.length > 150) {
    errors.title = 'Title cannot exceed 150 characters';
  }

  if (!values.customer) {
    errors.customer = 'Customer selection is required';
  }

  if (!values.category) {
    errors.category = 'Category is required';
  }

  if (!values.description || !values.description.trim()) {
    errors.description = 'Description is required';
  }

  return errors;
}
