import {
  db, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp,
  formatDoc, formatCollection, response, getNextSequence,
} from './api';

export const invoiceService = {
  async getAll() {
    const q = query(collection(db, 'invoices'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return response(formatCollection(snap));
  },

  async getById(id) {
    const snap = await getDoc(doc(db, 'invoices', id));
    const data = formatDoc(snap);
    if (!data) throw new Error('Invoice not found');
    return response(data);
  },

  /** Calculate totals from line items and persist as a new invoice. */
  async create(data) {
    const seq = await getNextSequence('invoices');
    const year = new Date().getFullYear();
    const invoiceNumber = `INV-${year}-${String(seq).padStart(3, '0')}`;

    const lineItems = data.lineItems || [];
    const subtotal = lineItems.reduce((s, item) => s + (Number(item.amount) || 0), 0);
    const taxTotal = lineItems.reduce(
      (s, item) => s + ((Number(item.amount) * (Number(item.taxRate) || 0)) / 100),
      0
    );
    const discount = Number(data.discount) || 0;
    const total = Math.max(subtotal + taxTotal - discount, 0);

    const docRef = await addDoc(collection(db, 'invoices'), {
      invoiceNumber,
      status: 'draft',
      currency: 'INR',
      amountPaid: 0,
      subtotal,
      taxTotal,
      discount,
      total,
      issueDate: new Date().toISOString(),
      paidAt: null,
      notes: '',
      ...data,
      // Always enforce calculated totals over whatever caller passed
      subtotal,
      taxTotal,
      total,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snap = await getDoc(docRef);
    return response(formatDoc(snap));
  },

  /** Recalculate totals if lineItems changed, then update. */
  async update(id, data) {
    const ref = doc(db, 'invoices', id);
    const payload = { ...data };

    if (payload.lineItems) {
      const lineItems = payload.lineItems;
      payload.subtotal = lineItems.reduce((s, item) => s + (Number(item.amount) || 0), 0);
      payload.taxTotal = lineItems.reduce(
        (s, item) => s + ((Number(item.amount) * (Number(item.taxRate) || 0)) / 100),
        0
      );
      const discount = Number(payload.discount) || 0;
      payload.total = Math.max(payload.subtotal + payload.taxTotal - discount, 0);
    }

    await updateDoc(ref, { ...payload, updatedAt: serverTimestamp() });
    const snap = await getDoc(ref);
    return response(formatDoc(snap));
  },

  async delete(id) {
    await deleteDoc(doc(db, 'invoices', id));
    return response({ id });
  },
};

export default invoiceService;
