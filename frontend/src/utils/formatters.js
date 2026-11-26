export function formatCurrency(amount, currency = 'INR') {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatDate(dateInput, includeTime = false) {
  if (!dateInput) return '—';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '—';

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime && { hour: '2-digit', minute: '2-digit' }),
  };

  return new Intl.DateTimeFormat('en-IN', options).format(date);
}

export function formatStatusLabel(status) {
  if (!status) return '';
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getStatusBadgeVariant(status) {
  switch (status) {
    case 'open':
    case 'scheduled':
    case 'draft':
    case 'pending':
      return 'info';
    case 'assigned':
    case 'in_progress':
    case 'partially_paid':
      return 'warning';
    case 'resolved':
    case 'completed':
    case 'paid':
    case 'available':
      return 'success';
    case 'closed':
    case 'busy':
      return 'secondary';
    case 'urgent':
    case 'high':
    case 'failed':
    case 'overdue':
    case 'cancelled':
    case 'on_leave':
    case 'offline':
      return 'danger';
    default:
      return 'default';
  }
}

export function getInitials(name) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatAddress(address) {
  if (!address) return 'N/A';
  const parts = [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ].filter(Boolean);
  return parts.join(', ');
}
