import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { validatePayment } from '../../validations/payment.validation';
import { PAYMENT_METHOD, PAYMENT_STATUS } from '../../constants/enums';

export const PaymentForm = ({
  invoices = [],
  customers = [],
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    invoice: '',
    customer: '',
    amount: '',
    method: PAYMENT_METHOD.UPI,
    status: PAYMENT_STATUS.COMPLETED,
    transactionId: '',
    gateway: 'Manual Entry',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  const handleInvoiceSelect = (invoiceId) => {
    const selectedInv = invoices.find((inv) => inv._id === invoiceId);
    setFormData((prev) => ({
      ...prev,
      invoice: invoiceId,
      customer: selectedInv?.customer?._id || selectedInv?.customer || prev.customer,
      amount: selectedInv ? (selectedInv.total - (selectedInv.amountPaid || 0)) : prev.amount,
    }));
    if (errors.invoice) setErrors((prev) => ({ ...prev, invoice: null }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const preparedData = {
      ...formData,
      amount: Number(formData.amount) || 0,
    };

    const validationErrors = validatePayment(preparedData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(preparedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Select Invoice to Pay"
          value={formData.invoice}
          onChange={(e) => handleInvoiceSelect(e.target.value)}
          error={errors.invoice}
        >
          <option value="" disabled>Select Invoice</option>
          {invoices.map((inv) => (
            <option key={inv._id} value={inv._id}>
              {inv.invoiceNumber} — Outstanding: ₹{inv.total - (inv.amountPaid || 0)}
            </option>
          ))}
        </Select>

        <Select
          label="Customer"
          value={formData.customer}
          onChange={(e) => handleChange('customer', e.target.value)}
          error={errors.customer}
        >
          <option value="" disabled>Select Customer</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.companyName || c.user?.name || c.customerCode}
            </option>
          ))}
        </Select>

        <Input
          label="Payment Amount (₹ INR)"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={formData.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
          error={errors.amount}
        />

        <Select
          label="Payment Method"
          value={formData.method}
          onChange={(e) => handleChange('method', e.target.value)}
          error={errors.method}
        >
          {Object.values(PAYMENT_METHOD).map((m) => (
            <option key={m} value={m}>
              {m.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </Select>

        <Input
          label="Transaction ID / UTR Number"
          placeholder="e.g., UPI/719280192/REF"
          value={formData.transactionId}
          onChange={(e) => handleChange('transactionId', e.target.value)}
        />

        <Select
          label="Payment Status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          {Object.values(PAYMENT_STATUS).map((st) => (
            <option key={st} value={st}>
              {st.toUpperCase()}
            </option>
          ))}
        </Select>
      </div>

      <Textarea
        label="Payment Notes & Receipts Reference"
        placeholder="Bank branch, cheque number, or reference details..."
        value={formData.notes}
        onChange={(e) => handleChange('notes', e.target.value)}
        rows={3}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
        <Button type="submit" variant="success" isLoading={isLoading} size="lg">
          Record Payment
        </Button>
      </div>
    </form>
  );
};
