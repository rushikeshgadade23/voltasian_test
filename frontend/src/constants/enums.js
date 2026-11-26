export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  TECHNICIAN: 'technician',
  CUSTOMER: 'customer',
};

export const TICKET_STATUS = {
  OPEN: 'open',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  ON_HOLD: 'on_hold',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  CANCELLED: 'cancelled',
};

export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const TICKET_CATEGORY = {
  INSTALLATION: 'installation',
  REPAIR: 'repair',
  MAINTENANCE: 'maintenance',
  INSPECTION: 'inspection',
  COMPLAINT: 'complaint',
};

export const CUSTOMER_TYPE = {
  INDIVIDUAL: 'individual',
  BUSINESS: 'business',
};

export const CONTACT_METHOD = {
  EMAIL: 'email',
  PHONE: 'phone',
  SMS: 'sms',
  WHATSAPP: 'whatsapp',
};

export const TECHNICIAN_AVAILABILITY = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  ON_LEAVE: 'on_leave',
  OFFLINE: 'offline',
};

export const INSTALLATION_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

export const INVOICE_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  PARTIALLY_PAID: 'partially_paid',
  PAID: 'paid',
  OVERDUE: 'overdue',
  VOID: 'void',
};

export const PAYMENT_METHOD = {
  CASH: 'cash',
  CARD: 'card',
  UPI: 'upi',
  BANK_TRANSFER: 'bank_transfer',
  CHEQUE: 'cheque',
  WALLET: 'wallet',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};
