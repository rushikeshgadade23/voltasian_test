import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { RoleGuard } from './RoleGuard';
import { AppLayout } from '../components/layouts/AppLayout';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';

// Dashboards
import { AdminDashboard } from '../pages/dashboard/AdminDashboard';
import { TechnicianDashboard } from '../pages/dashboard/TechnicianDashboard';

// Ticket Pages
import { TicketListPage } from '../pages/tickets/TicketListPage';
import { TicketDetailPage } from '../pages/tickets/TicketDetailPage';
import { CreateTicketPage } from '../pages/tickets/CreateTicketPage';
import { EditTicketPage } from '../pages/tickets/EditTicketPage';

// Customer Pages
import { CustomerListPage } from '../pages/customers/CustomerListPage';
import { CustomerDetailPage } from '../pages/customers/CustomerDetailPage';
import { CreateCustomerPage } from '../pages/customers/CreateCustomerPage';
import { EditCustomerPage } from '../pages/customers/EditCustomerPage';

// Technician Pages
import { TechnicianListPage } from '../pages/technicians/TechnicianListPage';
import { TechnicianDetailPage } from '../pages/technicians/TechnicianDetailPage';
import { CreateTechnicianPage } from '../pages/technicians/CreateTechnicianPage';
import { EditTechnicianPage } from '../pages/technicians/EditTechnicianPage';

// Installation Pages
import { InstallationListPage } from '../pages/installations/InstallationListPage';
import { InstallationDetailPage } from '../pages/installations/InstallationDetailPage';
import { CreateInstallationPage } from '../pages/installations/CreateInstallationPage';
import { EditInstallationPage } from '../pages/installations/EditInstallationPage';

// Invoice Pages
import { InvoiceListPage } from '../pages/invoices/InvoiceListPage';
import { InvoiceDetailPage } from '../pages/invoices/InvoiceDetailPage';
import { CreateInvoicePage } from '../pages/invoices/CreateInvoicePage';
import { EditInvoicePage } from '../pages/invoices/EditInvoicePage';

// Payment Pages
import { PaymentListPage } from '../pages/payments/PaymentListPage';
import { PaymentDetailPage } from '../pages/payments/PaymentDetailPage';
import { RecordPaymentPage } from '../pages/payments/RecordPaymentPage';

// User Pages
import { UserListPage } from '../pages/users/UserListPage';
import { UserDetailPage } from '../pages/users/UserDetailPage';
import { CreateUserPage } from '../pages/users/CreateUserPage';

// Profile & Error Pages
import { ProfilePage } from '../pages/profile/ProfilePage';
import { NotFoundPage } from '../pages/errors/NotFoundPage';
import { UnauthorizedPage } from '../pages/errors/UnauthorizedPage';

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'technician') {
    return <TechnicianDashboard />;
  }
  return <AdminDashboard />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* Dashboard */}
          <Route path="/" element={<DashboardRedirect />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/technician" element={<TechnicianDashboard />} />

          {/* Tickets */}
          <Route path="/tickets" element={<TicketListPage />} />
          <Route path="/tickets/create" element={<CreateTicketPage />} />
          <Route path="/tickets/:id" element={<TicketDetailPage />} />
          <Route path="/tickets/:id/edit" element={<EditTicketPage />} />

          {/* Customer Module */}
          <Route element={<RoleGuard roles={['admin', 'manager']} />}>
            <Route path="/customers" element={<CustomerListPage />} />
            <Route path="/customers/create" element={<CreateCustomerPage />} />
            <Route path="/customers/:id" element={<CustomerDetailPage />} />
            <Route path="/customers/:id/edit" element={<EditCustomerPage />} />
          </Route>

          {/* Field Technician Module */}
          <Route element={<RoleGuard roles={['admin', 'manager']} />}>
            <Route path="/technicians" element={<TechnicianListPage />} />
            <Route path="/technicians/create" element={<CreateTechnicianPage />} />
            <Route path="/technicians/:id" element={<TechnicianDetailPage />} />
            <Route path="/technicians/:id/edit" element={<EditTechnicianPage />} />
          </Route>

          {/* Installation Module */}
          <Route element={<RoleGuard roles={['admin', 'manager', 'technician']} />}>
            <Route path="/installations" element={<InstallationListPage />} />
            <Route path="/installations/create" element={<CreateInstallationPage />} />
            <Route path="/installations/:id" element={<InstallationDetailPage />} />
            <Route path="/installations/:id/edit" element={<EditInstallationPage />} />
          </Route>

          {/* Invoice Module */}
          <Route path="/invoices" element={<InvoiceListPage />} />
          <Route path="/invoices/create" element={<CreateInvoicePage />} />
          <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
          <Route path="/invoices/:id/edit" element={<EditInvoicePage />} />

          {/* Payment Module */}
          <Route path="/payments" element={<PaymentListPage />} />
          <Route path="/payments/record" element={<RecordPaymentPage />} />
          <Route path="/payments/:id" element={<PaymentDetailPage />} />

          {/* User Admin Module */}
          <Route element={<RoleGuard roles={['admin']} />}>
            <Route path="/users" element={<UserListPage />} />
            <Route path="/users/create" element={<CreateUserPage />} />
            <Route path="/users/:id" element={<UserDetailPage />} />
          </Route>

          {/* Profile & Errors */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
