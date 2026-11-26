export const ROUTES = {
  // Auth
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Dashboards
  DASHBOARD: '/',
  ADMIN_DASHBOARD: '/dashboard/admin',
  TECHNICIAN_DASHBOARD: '/dashboard/technician',

  // Tickets
  TICKETS: '/tickets',
  TICKET_CREATE: '/tickets/create',
  TICKET_DETAIL: '/tickets/:id',
  TICKET_EDIT: '/tickets/:id/edit',

  // Customers
  CUSTOMERS: '/customers',
  CUSTOMER_CREATE: '/customers/create',
  CUSTOMER_DETAIL: '/customers/:id',
  CUSTOMER_EDIT: '/customers/:id/edit',

  // Technicians
  TECHNICIANS: '/technicians',
  TECHNICIAN_CREATE: '/technicians/create',
  TECHNICIAN_DETAIL: '/technicians/:id',
  TECHNICIAN_EDIT: '/technicians/:id/edit',

  // Installations
  INSTALLATIONS: '/installations',
  INSTALLATION_CREATE: '/installations/create',
  INSTALLATION_DETAIL: '/installations/:id',
  INSTALLATION_EDIT: '/installations/:id/edit',

  // Invoices
  INVOICES: '/invoices',
  INVOICE_CREATE: '/invoices/create',
  INVOICE_DETAIL: '/invoices/:id',
  INVOICE_EDIT: '/invoices/:id/edit',

  // Payments
  PAYMENTS: '/payments',
  PAYMENT_RECORD: '/payments/record',
  PAYMENT_DETAIL: '/payments/:id',

  // Users
  USERS: '/users',
  USER_CREATE: '/users/create',
  USER_DETAIL: '/users/:id',

  // Profile & Error Pages
  PROFILE: '/profile',
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '*',
};
