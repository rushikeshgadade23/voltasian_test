import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { validateInvoice } from '../../validations/invoice.validation';
import { INVOICE_STATUS } from '../../constants/enums';

export const InvoiceForm = ({
  initialValues = {},
  customers = [],
  tickets = [],
  installations = [],
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    customer: initialValues.customer?._id || initialValues.customer || '',
    ticket: initialValues.ticket?._id || initialValues.ticket || '',
    installation: initialValues.installation?._id || initialValues.installation || '',
    dueDate: initialValues.dueDate ? new Date(initialValues.dueDate).toISOString().slice(0, 10) : '',
    status: initialValues.status || INVOICE_STATUS.DRAFT,
    discount: initialValues.discount || 0,
    notes: initialValues.notes || '',
    lineItems: initialValues.lineItems || [
      { description: 'Solar Equipment / Service Fee', quantity: 1, unitPrice: 5000, taxRate: 18, amount: 5000 },
    ],
  });

  const [errors, setErrors] = useState({});
  const [totals, setTotals] = useState({ subtotal: 0, taxTotal: 0, total: 0 });

  // Recalculate totals on line item or discount change
  useEffect(() => {
    let sub = 0;
    let tax = 0;
    formData.lineItems.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      const tRate = Number(item.taxRate) || 0;
      const amt = qty * price;
      sub += amt;
      tax += (amt * tRate) / 100;
    });

    const disc = Number(formData.discount) || 0;
    const grand = Math.max(sub + tax - disc, 0);

    setTotals({ subtotal: sub, taxTotal: tax, total: grand });
  }, [formData.lineItems, formData.discount]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleLineItemChange = (index, field, value) => {
    const updated = [...formData.lineItems];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      const qty = Number(field === 'quantity' ? value : updated[index].quantity) || 0;
      const price = Number(field === 'unitPrice' ? value : updated[index].unitPrice) || 0;
      updated[index].amount = qty * price;
    }
    setFormData((prev) => ({ ...prev, lineItems: updated }));
  };

  const addLineItem = () => {
    setFormData((prev) => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        { description: '', quantity: 1, unitPrice: 0, taxRate: 18, amount: 0 },
      ],
    }));
  };

  const removeLineItem = (index) => {
    if (formData.lineItems.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateInvoice(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      ...formData,
      subtotal: totals.subtotal,
      taxTotal: totals.taxTotal,
      total: totals.total,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          label="Payment Due Date"
          type="date"
          value={formData.dueDate}
          onChange={(e) => handleChange('dueDate', e.target.value)}
          error={errors.dueDate}
        />

        <Select
          label="Link Service Ticket (Optional)"
          value={formData.ticket}
          onChange={(e) => handleChange('ticket', e.target.value)}
        >
          <option value="">None</option>
          {tickets.map((t) => (
            <option key={t._id} value={t._id}>
              {t.ticketNumber} — {t.title}
            </option>
          ))}
        </Select>

        <Select
          label="Link Installation (Optional)"
          value={formData.installation}
          onChange={(e) => handleChange('installation', e.target.value)}
        >
          <option value="">None</option>
          {installations.map((inst) => (
            <option key={inst._id} value={inst._id}>
              {inst.installationNumber} — {inst.product?.name}
            </option>
          ))}
        </Select>

        <Select
          label="Invoice Status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          {Object.values(INVOICE_STATUS).map((st) => (
            <option key={st} value={st}>
              {st.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </Select>

        <Input
          label="Discount Amount (₹ INR)"
          type="number"
          min="0"
          value={formData.discount}
          onChange={(e) => handleChange('discount', e.target.value)}
        />
      </div>

      {/* Dynamic Line Items Table */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">Invoice Line Items</p>
          <Button variant="outline" size="sm" onClick={addLineItem} icon={Plus}>
            Add Line Item
          </Button>
        </div>

        {errors.lineItems && <p className="text-xs text-rose-400 font-medium">{errors.lineItems}</p>}

        <div className="space-y-3">
          {formData.lineItems.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 grid grid-cols-12 gap-3 items-end">
              <div className="col-span-12 md:col-span-5">
                <Input
                  label={idx === 0 ? 'Description' : ''}
                  placeholder="Item description or service..."
                  value={item.description}
                  onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                />
              </div>

              <div className="col-span-4 md:col-span-2">
                <Input
                  label={idx === 0 ? 'Qty' : ''}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleLineItemChange(idx, 'quantity', e.target.value)}
                />
              </div>

              <div className="col-span-4 md:col-span-2">
                <Input
                  label={idx === 0 ? 'Unit Price (₹)' : ''}
                  type="number"
                  min="0"
                  value={item.unitPrice}
                  onChange={(e) => handleLineItemChange(idx, 'unitPrice', e.target.value)}
                />
              </div>

              <div className="col-span-3 md:col-span-2">
                <Input
                  label={idx === 0 ? 'GST %' : ''}
                  type="number"
                  min="0"
                  value={item.taxRate}
                  onChange={(e) => handleLineItemChange(idx, 'taxRate', e.target.value)}
                />
              </div>

              <div className="col-span-1 flex items-center justify-center pb-2">
                <button
                  type="button"
                  onClick={() => removeLineItem(idx)}
                  className="text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Box */}
      <div className="p-5 glass-card rounded-xl border border-slate-800 max-w-sm ml-auto space-y-2 text-sm">
        <div className="flex justify-between text-slate-400">
          <span>Subtotal:</span>
          <span className="font-semibold text-slate-200">{formatCurrency(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Total GST Tax:</span>
          <span className="font-semibold text-slate-200">{formatCurrency(totals.taxTotal)}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Discount:</span>
          <span className="font-semibold text-emerald-400">- {formatCurrency(formData.discount)}</span>
        </div>
        <div className="pt-2 border-t border-slate-800 flex justify-between text-base font-bold text-slate-100">
          <span>Grand Total:</span>
          <span className="text-brand-400">{formatCurrency(totals.total)}</span>
        </div>
      </div>

      <Textarea
        label="Payment Terms & Notes"
        placeholder="Payment due within 14 days of invoice date..."
        value={formData.notes}
        onChange={(e) => handleChange('notes', e.target.value)}
        rows={3}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
        <Button type="submit" variant="primary" isLoading={isLoading} size="lg">
          {initialValues._id ? 'Save Invoice' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
};
